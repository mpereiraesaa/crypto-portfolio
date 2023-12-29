import { body, param, CustomValidator } from "express-validator";
import { supportedAssets } from "../config";
import { Asset } from "../config/types";

const isValidAsset: CustomValidator = (value: string): boolean => {
  return supportedAssets().some((asset: Asset) => {
    return asset.baseAsset.toLowerCase() === value.toLowerCase()
  })
};

const ONBOARDING_RULES = [body("email").isEmail(), body("password").isLength({ min: 6 })];
const SIGNIN_RULES = [body("email").isEmail(), body("password").exists()];
const ADD_ASSET_HOLDING_RULES = [body('asset').custom(isValidAsset), body("quantity").default(0).isNumeric()];
const UPDATE_ASSET_HOLDING_RULES = [param('asset').custom(isValidAsset), body("quantity").isNumeric()];
const REMOVE_ASSET_HOLDING_RULES = [param('asset').custom(isValidAsset)]

const TRANSACTION_VALIDATION_RULES = [
  body('type').isIn(["buy", "sell"]),
  body('asset').custom(isValidAsset),
  body('quantity').isNumeric()
];

export {
  ONBOARDING_RULES,
  SIGNIN_RULES,
  ADD_ASSET_HOLDING_RULES,
  UPDATE_ASSET_HOLDING_RULES,
  REMOVE_ASSET_HOLDING_RULES,
  TRANSACTION_VALIDATION_RULES
}
