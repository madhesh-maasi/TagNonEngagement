import * as React from "react";
import styles from "./SubmitCombineReviews.module.scss";
import { ISubmitCombineReviewsProps } from "./ISubmitCombineReviewsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  Dropdown,
  IDropdownOption,
  Label,
  PrimaryButton,
  TextField,
} from "office-ui-fabric-react";
import {
  DateConvention,
  DateTimePicker,
  TimeConvention,
  TimeDisplayControlType,
} from "@pnp/spfx-controls-react/lib/DateTimePicker";
import ListItemService from "../../../services/ListItemService";
import { TAG_CombineReviews } from "../../../domain/models/TAG_CombineReviews";
import { SubmitCombineReviewsState } from "./SubmitCombineReviewsState";
import { Config } from "../../../globals/Config";
import { Enums } from "../../../globals/Enums";

export default class SubmitCombineReviews extends React.Component<
  ISubmitCombineReviewsProps,
  SubmitCombineReviewsState,
  {}
> {
  private ServiceLines: IDropdownOption[] = [];
  private ListItemService: ListItemService;
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
  constructor(props: any) {
    super(props);
    this.state = {
      IsCreateMode:
        this.props.ItemID == undefined ||
        this.props.ItemID == null ||
        this.props.ItemID == 0
          ? true
          : false,
      hasEditItemPermission: false,
      IsLoading: true,
      AppContext: this.props.AppContext,
      CombineReviews: new TAG_CombineReviews(),
      DisableSaveButton: true,
    };

    let dropDownOption: any[] = [];
    dropDownOption.push({
      key: "Capital Markets & Accounting Advisory",
      text: "Capital Markets & Accounting Advisory",
    });
    dropDownOption.push({
      key: "Financial Due Diligence",
      text: "Financial Due Diligence",
    });
    dropDownOption.push({
      key: "Global Transaction Analytics",
      text: "Global Transaction Analytics",
    });
    this.ServiceLines = dropDownOption;

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeReviewIDs = this.onChangeReviewIDs.bind(this);
    this.onchangedLastDateHoursBilled =
      this.onchangedLastDateHoursBilled.bind(this);
    this.onchangedProjectStartDate = this.onchangedProjectStartDate.bind(this);
    this.onchangedProjectEndDate = this.onchangedProjectEndDate.bind(this);
    this.onChangeTitleofCombinedReview =
      this.onChangeTitleofCombinedReview.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangeClientName = this.onChangeClientName.bind(this);
    this.onChangeServiceLines = this.onChangeServiceLines.bind(this);
  }

  public async componentDidMount() {
    if (this.state.IsCreateMode) {
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineReviews
      );
      this.hasEditItemPermission =
        await this.ListItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const CombineReviewsDetails: TAG_CombineReviews =
        await this.ListItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.TAG_CombinedReview
        );
      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        CombineReviews: CombineReviewsDetails,
      });
    }
  }

  private _onFormatDate = (date: Date): string => {
    return (
      // date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
      date.getMonth() +
      1 +
      "/" +
      (date.getDate() + 1) +
      "/" +
      date.getFullYear()
    );
  };
  private async FillJobTitle() {
    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.CombineReviews
    );
    let GetServiceLine = await this.ListItemService.getFieldChoices(
      Config.CombineReviewsListColumns.JobTitle
    );
    let GetServiceLineOption: any[] = [];
    if (GetServiceLine != undefined) {
      var j = 0;
      for (var i = 0; i < Object.keys(GetServiceLine).length; i++) {
        var qData = {};
        qData["text"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        qData["key"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        GetServiceLineOption.push(qData);
      }
    }
    // this.JobTitle = GetServiceLineOption;
  }

  private onChangeReviewIDs(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.CombineReviews;
    curretState.ReviewIDs = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeTitleofCombinedReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.CombineReviews;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeClientName(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValueText: string
  ): void {
    let curretState = this.state.CombineReviews;
    curretState.ClientName = newValueText;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeServiceLines(newValue1: string): void {
    let curretState = this.state.CombineReviews;
    curretState.ServiceLine = newValue1;
    this.onFormTextFieldValueChange(curretState);
  }
  private onchangedLastDateHoursBilled(date: any): void {
    let curretState = this.state.CombineReviews;
    curretState.LastHoursBilled = date;
    this.onFormTextFieldValueChange(curretState);
  }

  private onchangedProjectStartDate(date1: any): void {
    let curretState = this.state.CombineReviews;
    curretState.ProjectStartDate = date1;
    this.onFormTextFieldValueChange(curretState);
  }

  private onchangedProjectEndDate(date2: any): void {
    let curretState = this.state.CombineReviews;
    curretState.ProjectEndDate = date2;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeJobTitle(newValue: string): void {
    let curretState = this.state.CombineReviews;
    curretState.JobTitle = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private validateSave(updateDetails: TAG_CombineReviews): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (
      updateDetails.Title != "" &&
      updateDetails.Title != undefined &&
      updateDetails.ReviewIDs != "" &&
      updateDetails.ReviewIDs != undefined &&
      updateDetails.JobTitle != "" &&
      updateDetails.JobTitle != undefined &&
      updateDetails.ServiceLine != "" &&
      updateDetails.ServiceLine != undefined &&
      updateDetails.ProjectStartDate != undefined &&
      updateDetails.ProjectEndDate != undefined &&
      updateDetails.ClientName != "" &&
      updateDetails.ClientName != undefined
    ) {
      valid = true;
    }
    return valid;
  }

  private onFormTextFieldValueChange(updateDetails: TAG_CombineReviews) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      CombineReviews: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }

  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }

  private async onSave(): Promise<void> {
    const CombineReviews = this.state.CombineReviews;
    let data = {};
    const columns = Config.CombineReviewsListColumns;
    data[Config.BaseColumns.Title] = CombineReviews.Title;
    data[columns.ReviewIDs] = CombineReviews.ReviewIDs;
    data[columns.JobTitle] = CombineReviews.JobTitle;
    data[columns.LastHoursBilled] = CombineReviews.LastHoursBilled;
    data[columns.ProjectStartDate] = CombineReviews.ProjectStartDate;
    data[columns.ProjectEndDate] = CombineReviews.ProjectEndDate;
    data[columns.ClientName] = CombineReviews.ClientName;
    data[columns.ServiceLine] = CombineReviews.ServiceLine;

    if (this.state.IsCreateMode) {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineReviews
      );
      await this.ListItemService.createItem(data);
      this.gotoListPage();
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineReviews
      );
      await this.ListItemService.updateItem(this.props.ItemID, data);
      this.gotoListPage();
    }
  }
  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }

  public render(): React.ReactElement<ISubmitCombineReviewsProps> {
    return (
      <React.Fragment>
        <div className={styles.submitCombineReviews}>
          <div className={styles.container}>
            <hr></hr>

            <img
              src={require("../../../assets/Images/performancemgmtgraphic.png")}
              alt="Performance Management"
              className="fullimg"
            />
            <div className={styles.row}>
              <div className={styles.divCompetency}>
                <Label>
                  <b>INSTRUCTIONS: </b>Consult the list of eligible ID numbers
                  at the bottom of the page. Then enter two or more of these ID
                  numbers in the designated textbox below, separated by commas
                  without spaces. Complete all other required information and
                  submit to create a new Combined Review.
                </Label>
              </div>
              <div className={styles.divCompetency}>
                <Label>
                  Note: Once a review has been combined into another review it
                  can no longer be used. Use the combined review instead.
                </Label>
              </div>
              <hr className={styles.hrmargin}></hr>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>
                      Review IDs to combine:{" "}
                      <span style={{ color: "#ff0000" }}> * </span>
                      <br />
                      Separate with commas - no spaces. Example: 12,15,20
                    </b>
                  </Label>
                </div>
                <div className={styles.txtReview}>
                  <TextField
                    resizable={false}
                    multiline={false}
                    value={this.state.CombineReviews.ReviewIDs}
                    onChange={this.onChangeReviewIDs}
                  ></TextField>{" "}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  {" "}
                  <Label>
                    <b>Combined Review's Title </b>{" "}
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReview}>
                  <TextField
                    resizable={false}
                    multiline={false}
                    value={this.state.CombineReviews.Title}
                    onChange={this.onChangeTitleofCombinedReview}
                  ></TextField>{" "}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  {" "}
                  <Label>
                    <b>Client Name </b>{" "}
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReview}>
                  <TextField
                    resizable={false}
                    multiline={false}
                    value={this.state.CombineReviews.ClientName}
                    onChange={this.onChangeClientName}
                  ></TextField>{" "}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  {" "}
                  <Label>
                    <b>Service Line: </b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReview}>
                  <Dropdown
                    className={styles.dropServiceLine}
                    options={this.ServiceLines}
                    placeholder="Please Select a Value"
                    selectedKey={this.state.CombineReviews.ServiceLine}
                    onChange={(e, selectedOption) => {
                      this.onChangeServiceLines(selectedOption.text);
                    }}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  {" "}
                  <Label>
                    <b>Project Start Date </b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReview}>
                  <DateTimePicker
                    dateConvention={DateConvention.Date}
                    timeConvention={TimeConvention.Hours12}
                    timeDisplayControlType={TimeDisplayControlType.Dropdown}
                    showLabels={false}
                    formatDate={this._onFormatDate}
                    value={this.state.CombineReviews.ProjectStartDate}
                    onChange={this.onchangedProjectStartDate}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  {" "}
                  <Label>
                    <b>Project End Date </b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReview}>
                  <DateTimePicker
                    dateConvention={DateConvention.Date}
                    timeConvention={TimeConvention.Hours12}
                    timeDisplayControlType={TimeDisplayControlType.Dropdown}
                    showLabels={false}
                    formatDate={this._onFormatDate}
                    value={this.state.CombineReviews.ProjectEndDate}
                    onChange={this.onchangedProjectEndDate}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>
                      Last Date Hours Billed <br />
                      (if known)
                    </b>
                  </Label>
                </div>
                <div className={styles.txtReview}>
                  <DateTimePicker
                    dateConvention={DateConvention.Date}
                    timeConvention={TimeConvention.Hours12}
                    timeDisplayControlType={TimeDisplayControlType.Dropdown}
                    showLabels={false}
                    formatDate={this._onFormatDate}
                    value={this.state.CombineReviews.LastHoursBilled}
                    onChange={this.onchangedLastDateHoursBilled}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>
                      Job Title of Combined Review{" "}
                      <span style={{ color: "#ff0000" }}> * </span>
                      <br />
                      (This determines the review template)
                    </b>
                  </Label>
                </div>
                <div className={styles.txtReview}>
                  <Dropdown
                    className={styles.dropServiceLine}
                    options={this.JobTitleOptions}
                    selectedKey={this.state.CombineReviews.JobTitle}
                    placeholder="Please Select Value"
                    onChange={(e, selectedOption) => {
                      this.onChangeJobTitle(selectedOption.text);
                    }}
                  />
                </div>
              </div>
              <div className={styles.btnleft}>
                {this.state.IsCreateMode && (
                  <PrimaryButton
                    className={
                      this.state.DisableSaveButton
                        ? styles.btnSave
                        : styles.btnSaveEnable
                    }
                    text="CREATE COMBINED REVIEW"
                    disabled={this.state.DisableSaveButton}
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
        </div>
      </React.Fragment>
    );
  }
}
