import * as React from "react";
import styles from "./SubmitSplitReviews.module.scss";
import { ISubmitSplitReviewsProps } from "./ISubmitSplitReviewsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  Dropdown,
  IDropdownOption,
  Label,
  PrimaryButton,
  TextField,
} from "office-ui-fabric-react";
import { TAG_SplitReviews } from "../../../domain/models/TAG_SplitReviews";
import ListItemService from "../../../services/ListItemService";
import { SubmitSplitReviewsState } from "./SubmitSplitReviewsState";
import { Config } from "../../../globals/Config";
import { Enums } from "../../../globals/Enums";

export default class SubmitSplitReviews extends React.Component<
  ISubmitSplitReviewsProps,
  SubmitSplitReviewsState,
  {}
> {
  private listSplitReviewsItemService: ListItemService;
  private hasEditItemPermission: boolean = true;
  private JobTitleOptions: IDropdownOption[] = [
    { key: "Analyst", text: "Analyst" },
    { key: "Associate", text: "Associate" },
    { key: "Senior Associate", text: "Senior Associate" },
    { key: "Manager", text: "Manager" },
    { key: "Senior Manager", text: "Senior Manager" },
    { key: "Director", text: "Director" },
    { key: "Senior Director", text: "Senior Director" },
  ];
  private ServiceLineOptions: IDropdownOption[] = [
    {
      key: "Capital Markets & Accounting Advisory",
      text: "Capital Markets & Accounting Advisory",
    },
    { key: "Financial Due Diligence", text: "Financial Due Diligence" },
    {
      key: "Global Transaction Analytics",
      text: "Global Transaction Analytics",
    },
  ];

  constructor(props: any) {
    super(props);
    this.state = {
      AppContext: this.props.context,
      IsLoading: true,
      hasEditItemPermission: false,
      SplitReviews: new TAG_SplitReviews(),
      IsCreateMode:
        this.props.ItemID == undefined ||
        this.props.ItemID == null ||
        this.props.ItemID == 0
          ? true
          : false,
      DisableSaveButton: true,
    };

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeSourceReviewID = this.onChangeSourceReviewID.bind(this);
    this.onChangeHourstoReview = this.onChangeHourstoReview.bind(this);
    this.onChangeTitleofnewSplitReview =
      this.onChangeTitleofnewSplitReview.bind(this);
    this.onChangeServiceLine = this.onChangeServiceLine.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
  }
  public async componentDidMount() {
    if (this.state.IsCreateMode) {
    } else {
      this.listSplitReviewsItemService = new ListItemService(
        this.props.context,
        Config.ListNames.SplitReviews
      );
      this.hasEditItemPermission =
        await this.listSplitReviewsItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const SplitReviewsDetails: TAG_SplitReviews =
        await this.listSplitReviewsItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.TAG_SplitReview
        );

      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        SplitReviews: SplitReviewsDetails,
      });
    }
  }

  private async onCancel(): Promise<void> {
    this.redirect();
  }

  private redirect() {
    let returnURL =
      this.props.context.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }

  private async onSave(): Promise<void> {
    const splitReviews = this.state.SplitReviews;
    let data = {};
    const columns = Config.SplitReviewsListColumns;
    data[Config.BaseColumns.Title] = splitReviews.Title;
    data[columns.HourstoReview] = Number(splitReviews.HourstoReview);
    data[columns.SourceReviewID] = Number(splitReviews.SourceReviewID);
    data[columns.ServiceLine] = splitReviews.ServiceLine;
    data[columns.JobTitle] = splitReviews.JobTitle;

    if (this.state.IsCreateMode) {
      this.listSplitReviewsItemService = new ListItemService(
        this.props.context,
        Config.ListNames.SplitReviews
      );
      await this.listSplitReviewsItemService.createItem(data);
      this.redirect();
    } else {
      this.listSplitReviewsItemService = new ListItemService(
        this.props.context,
        Config.ListNames.SplitReviews
      );
      await this.listSplitReviewsItemService.updateItem(
        this.props.ItemID,
        data
      );
      this.redirect();
    }
  }

  private onChangeServiceLine(ServiceLine: string): void {
    let curretState = this.state.SplitReviews;
    curretState.ServiceLine = ServiceLine;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeJobTitle(JobTitle: string): void {
    let curretState = this.state.SplitReviews;
    curretState.JobTitle = JobTitle;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeSourceReviewID(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.SplitReviews;
    curretState.SourceReviewID = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeHourstoReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.SplitReviews;
    curretState.HourstoReview = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeTitleofnewSplitReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.SplitReviews;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private validateSave(updateDetails: TAG_SplitReviews): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (
      updateDetails.Title != "" &&
      updateDetails.Title != undefined &&
      updateDetails.SourceReviewID != "" &&
      updateDetails.SourceReviewID != undefined &&
      updateDetails.JobTitle != "" &&
      updateDetails.JobTitle != undefined &&
      updateDetails.ServiceLine != "" &&
      updateDetails.ServiceLine != undefined
    ) {
      valid = true;
    }
    return valid;
  }

  private onFormTextFieldValueChange(updateDetails: TAG_SplitReviews) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      SplitReviews: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }
  public render(): React.ReactElement<ISubmitSplitReviewsProps> {
    return (
      <div className={styles.SubmitSplitReviews}>
        <div className={styles.container}>
          <img
            src={require("../../../assets/Images/performancemgmtgraphic.png")}
            alt="Performance Management"
            className="fullimg"
          />
          <hr className={styles.hr}></hr>
          <div className={styles.lblTopText}>
            <div className={styles.divCompetency}>
              <Label>
                <b>
                  <span style={{ color: "#ff0000" }}>BEFORE YOU BEGIN: </span>
                </b>
                Identify the ID number of the review you would like to split
                into an additional review. You may split any unstarted review
                into an additional review, even if it has been split before.
                Consult the lists below for reviews you are eligible to split.
              </Label>
            </div>
            <div className={styles.divCompetency}>
              <Label>
                {" "}
                You may not split reviews which have already started, nor can
                you split reviews previously combined.
              </Label>
            </div>

            <div className={styles.divCompetency}>
              <Label>
                If you need additional assistance, please contact the TAG
                Performance Administrators.{" "}
              </Label>
            </div>
          </div>
          <hr className={styles.hr}></hr>

          <div className={styles.row}>
            <div className={styles.lblSourceReviewID}>
              {" "}
              <Label>
                <b>
                  Source Review ID (Choose from below):{" "}
                  <span style={{ color: "#ff0000" }}>*</span>
                </b>
              </Label>
            </div>
            <div className={styles.txtSourceReviewID}>
              {" "}
              <TextField
                resizable={false}
                multiline={false}
                value={this.state.SplitReviews.SourceReviewID}
                onChange={this.onChangeSourceReviewID}
              ></TextField>{" "}
            </div>

            <div className={styles.lblHourstoReview}>
              {" "}
              <Label>
                <b>Hours to Review </b>
              </Label>
            </div>
            <div className={styles.txtSourceReviewID}>
              <TextField
                resizable={false}
                multiline={false}
                value={this.state.SplitReviews.HourstoReview}
                onChange={this.onChangeHourstoReview}
              ></TextField>{" "}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.lblSourceReviewID}>
              <Label className={styles.lblText}>
                <b>Title of new Split Review</b> <br />
                <b>(Example: Acme Software Implementation - Phase 1) </b>
              </Label>
            </div>
            <div className={styles.txtSourceReviewID}>
              {" "}
              <TextField
                resizable={false}
                multiline={false}
                value={this.state.SplitReviews.Title}
                onChange={this.onChangeTitleofnewSplitReview}
              ></TextField>{" "}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.lblSourceReviewID}>
              {" "}
              <Label>
                <b>
                  Service Line <span style={{ color: "#ff0000" }}>*</span>
                </b>
              </Label>
            </div>
            <div className={styles.txtSourceReviewID}>
              <Dropdown
                placeholder="Please Select a value"
                selectedKey={this.state.SplitReviews.ServiceLine}
                onChange={(e, selectedOption) => {
                  this.onChangeServiceLine(selectedOption.text);
                }}
                options={this.ServiceLineOptions}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.lblSourceReviewID}>
              {" "}
              <Label>
                <b>
                  Job Title <span style={{ color: "#ff0000" }}>*</span>
                </b>
              </Label>
            </div>
            <div className={styles.txtSourceReviewID}>
              <Dropdown
                placeholder="Please Select a value"
                selectedKey={this.state.SplitReviews.JobTitle}
                onChange={(e, selectedOption) => {
                  this.onChangeJobTitle(selectedOption.text);
                }}
                options={this.JobTitleOptions}
              />
            </div>
          </div>

          <div className={styles.divFullWidth}>
            {this.state.IsCreateMode && (
              <PrimaryButton
                className={
                  this.state.DisableSaveButton
                    ? styles.btnSave
                    : styles.btnSaveEnable
                }
                disabled={this.state.DisableSaveButton}
                text="CREATE SPLIT REVIEW"
                onClick={this.onSave}
              ></PrimaryButton>
            )}
            <PrimaryButton
              className={styles.btnCancel}
              text="Cancel"
              onClick={this.onCancel}
            ></PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}
