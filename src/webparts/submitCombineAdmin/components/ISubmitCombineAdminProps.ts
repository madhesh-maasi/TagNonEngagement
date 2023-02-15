import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISubmitCombineAdminProps {
  description: string;
  AppContext : WebPartContext;
  ItemID:number;
}

