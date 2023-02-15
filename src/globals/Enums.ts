export namespace Enums {

    export enum FieldTypes {
        TaxonomyMulti = "TaxonomyFieldTypeMulti",
        TaxonomySingle = "TaxonomyFieldType",
        PersonMulti = "UserMulti",
        PersonSingle = "User",
        Link = "URL",
        Lookup = "",
        LookupMulti = ""
    }

    export enum MapperType {
        PNPResult,
        PnPControlResult,
        CAMLResult,
        SearchResult,
        None
    }

    export enum ItemResultType{
        
        //Common Result Types
        None,
        User,
        UserProfile,
        Users,
        Document,
        Item,
        Task,

        //Solution Specific Result Types
        TAG_EmployeeDetails,
        TAG_ItemID,
        TAG_MentorDetails,
        TAG_Roles,
        TAG_FiscalYear,
        TAG_NonEngReviewSummary,
        TAG_Projects,
        TAG_SplitReview,
        TAG_SpecialReview,
        TAG_CombinedReview,
        TAG_CombineAdmin,
        TAG_SplitAdmin
    }

    export enum DataPayloadTypes{
        PnPCreateUpdate,
        PnPValidateUpdate
    }

    export enum ButtonTypes {
        Save
    }

    export enum UserRoles {
        Reviewee,
        Reviewer,
        SuperAdmin
    }

    export enum FormModes{
        CollectFeedback,
        SubmitFeedback,
        NotFinalized,
        MixMode
    }
}