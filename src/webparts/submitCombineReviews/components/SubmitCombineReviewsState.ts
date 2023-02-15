import { TAG_CombineReviews } from "../../../domain/models/TAG_CombineReviews";
import { IBaseInterface } from "../../../interfaces/IBaseInterface";

export interface SubmitCombineReviewsState extends IBaseInterface {
    CombineReviews: TAG_CombineReviews;
    IsCreateMode:boolean;
    hasEditItemPermission : boolean;
    DisableSaveButton:boolean
} 
