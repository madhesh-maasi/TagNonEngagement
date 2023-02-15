import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { TAG_CombineAdmin } from "../../../domain/models/TAG_CombineAdmin";

export interface SubmitCombineAdminState extends IBaseInterface {
    CombineAdmin: TAG_CombineAdmin;
    IsCreateMode:boolean;
    hasEditItemPermission : boolean;
    DisableSaveButton:boolean;
    IsShowForm:boolean;
    NewItemID:number;
    ProjectListViewItems:any;
    IsReviewerNameEnable:boolean;
} 