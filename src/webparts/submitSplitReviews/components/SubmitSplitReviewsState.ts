import { TAG_SplitReviews } from "../../../domain/models/TAG_SplitReviews";
import { IBaseInterface } from "../../../interfaces/IBaseInterface";
export interface SubmitSplitReviewsState extends IBaseInterface {
    IsCreateMode:boolean;
    hasEditItemPermission:boolean;
    SplitReviews: TAG_SplitReviews;
    DisableSaveButton:boolean;
}