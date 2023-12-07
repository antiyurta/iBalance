import { api } from "@/feature/interceptor/interceptor";
import {
  IResponseGiftCarts,
  IResponseGiftCart,
  IParamGiftCart,
  ICreateExpenseGiftCart,
  ICreateIncomeGiftCart,
} from "./entities";

function get(params: IParamGiftCart): Promise<IResponseGiftCarts> {
  return api.get("gift-cart", { params });
}
function expense(body: ICreateExpenseGiftCart): Promise<IResponseGiftCart> {
  return api.post("gift-cart/expense", body);
}
function income(body: ICreateIncomeGiftCart): Promise<IResponseGiftCart> {
  return api.post("gift-cart/income", body);
}

export const GiftCartService = { get, expense, income };
