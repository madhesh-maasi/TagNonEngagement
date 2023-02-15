import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { TAG_SpecialReviews } from "../../../domain/models/TAG_SpecialReviews";

export interface SubmitSpecialReviewsState extends IBaseInterface {
    SpecialReviews: TAG_SpecialReviews;
    IsCreateMode: boolean;
    hasEditItemPermission: boolean;
    DisableSaveButton:boolean;
} 