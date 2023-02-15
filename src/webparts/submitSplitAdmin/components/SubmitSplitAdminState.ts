import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { TAG_SplitAdmin } from "../../../domain/models/TAG_SplitAdmin";
import { Enums } from "../../../globals/Enums";


export interface SubmitSplitAdminState extends IBaseInterface {
    SplitAdmin: TAG_SplitAdmin;
    IsCreateMode:boolean;
    hasEditItemPermission : boolean;
    DisableSaveButton:boolean;
    IsShowForm:boolean;
    NewItemID:number;
    ProjectListViewItems:any;
    ProjectList_StatusOfReviewSplitViewItems:any;
    Project_AllProjectStatusSplitListViewItems:any;
    IsReviewerNameEnable : boolean;
} 