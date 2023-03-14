import * as React from "react";
import styles from "../AnmNonEngagement.module.scss";
import { IAnmNonEngagementProps } from "../IAnmNonEngagementProps";
import { escape } from "@microsoft/sp-lodash-subset";
import ListItemService from "../../../../services/ListItemService";
import UserService from "../../../../services/UserService";
import { Config } from "../../../../globals/Config";
import { Enums } from "../../../../globals/Enums";
import { User } from "../../../../domain/models/types/User";
import MapResult from "../../../../domain/mappers/MapResult";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { TAG_GenericDetails } from "../../../../domain/models/TAG_EmployeeDetails";
import RevieweeForm from "./RevieweeForm";
import Dropdown from "react-dropdown";
//import {IDropdownOption} from '@fluentui/react';
import { sp } from "@pnp/sp";

import Dialog, {
  DialogFooter,
  DialogType,
} from "office-ui-fabric-react/lib/Dialog";
const dialogContentProps = {
  type: DialogType.normal,
  title: "Confirmation",
  subText: "Data saved successfully.",
};
export default class Reviewee extends React.Component<
  IAnmNonEngagementProps,
  {}
> {
  // private ReviewTypeOptions: IDropdownOption[]= [];
  private listItemService: ListItemService;
  private userService: UserService;
  private webUrl = "";
  constructor(props: any) {
    super(props);
    this.state = {
      IsLoading: true,
      AppContext: this.props.AppContext,
      allFiscalYear: [],
      allRoles: [],
      selectedFYYear: "",
      selectedRole: "",
      fields: {},
      currentuser: {},
      mentor: {},
      showModel: true,
      showAssigneeForm: true.valueOf,
      ReviewType: "",
      ReviewTypeOptions: [],
      selectedReviewType: "",
      IsAdmin: false,
      RevieweeName: {},
      RevieweeNameEmail: "",
      CurrentUserRoles: [],
    };
    this.onChangeRevieweeName = this.onChangeRevieweeName.bind(this);
    this.getAnnualReview = this.getAnnualReview.bind(this);
  }
  public async componentDidMount() {
    // Fetch Loggred user name, Roles and tax year, Mentor
    // this.ReviewTypeOptions = [{ text: 'Mid Year', key: 'Mid Year' },{text: 'Year End', key: 'Year End'}];
    const ReviewTypeState = [
      { value: "Mid Year", label: "Mid Year" },
      { value: "Year End", label: "Year End" },
    ];

    this.webUrl = await sp.site.getWebUrlFromPageUrl(window.location.href);
    console.log("props", this.props);

    this.listItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.FiscalYears
    );

    const allFiscalYear: TAG_GenericDetails[] =
      await this.listItemService.getItemsUsingCAML(
        [Config.BaseColumns2.Title],
        Config.BaseColumns2.SortOrder,
        "",
        100,
        Enums.ItemResultType.TAG_FiscalYear
      );

    this.listItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.NonEngReview
    );
    const allChoiceRoles: string[] = await this.listItemService.getFieldChoices(
      Config.NonEngagementReviewTemplateColumns.Role
    );
    console.log("allChoiceRoles", allChoiceRoles);

    const newState = allFiscalYear.map((obj) => {
      // 👇️ if id equals 2, update country property
      return { ...obj, value: obj["Title"], label: obj["Title"] };
    });
    const newallRoles = allChoiceRoles.map((obj) => {
      // 👇️ if id equals 2, update country property
      return { value: obj, label: obj };
    });
    // const userRoles: Enums.UserRoles[] = await this.GetCurrentUserRoles();
    this.listItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.Mentor
    );
    const mentor: User = await this.listItemService.GetMentorOfEmployee(
      this.props.user
    );

    this.userService = new UserService(this.props.AppContext);
    //let CurrentUserIsAdmin: boolean = await this.userService.CheckCurrentUserIsAdmin();
    let CurrentUserIsAdmin: boolean =
      await this.userService.CheckCurrentUserIsFullControl();
    this.setState({
      IsAdmin: CurrentUserIsAdmin,
      ReviewTypeOptions: ReviewTypeState,
      allFiscalYear: newState,
      allRoles: newallRoles,
      currentuser: this.props.user,
      mentor: mentor,
      selectedFYYear: {
        value: "" + new Date().getFullYear(),
        label: new Date().getFullYear(),
      },
    });
  }
  private async onChangeRevieweeName(items: any[]) {
    if (items != null && items.length > 0) {
      let RevieweeName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      let RevieweeNameEmail = RevieweeName.Email;
      this.setState({
        RevieweeName: RevieweeName,
        RevieweeNameEmail: RevieweeNameEmail,
      });
    }
  }

  public getAnnualReview(): JSX.Element {
    if (
      !this.state["selectedRole"] &&
      !this.state["selectedFYYear"] &&
      !this.state["selectedReviewType"]
    ) {
      return (
        <div>
          <div style={{ color: "red", fontWeight: 600 }}>
            After you click Start Review, you will be taken back to the TAG
            Performance Management landing page.
          </div>
          <div>
            From there, to access & complete your Non-Engagement Review, please
            go to{" "}
            <span style={{ fontWeight: 600 }}>
              Home / Reviewee / Non Engagement Reviews Where I Am The Reviewee.
            </span>
          </div>
        </div>
      );
    }
  }

  public render(): React.ReactElement<any> {
    //  debugger;
    return (
      <div className={styles.anmNonEngagement}>
        {this.state["showAssigneeForm"] && (
          <div>
            <div className="titlebar">
              <span className={styles.boldlabel}>REVIEWEE:</span>
              <span>
                {" "}
                To initiate a review, indicate the Fiscal Year, Role and then
                click on
              </span>
              <span className={styles.boldlabel}> Start Reivew</span>
            </div>

            {this.state["IsAdmin"] && (
              <div className={styles.AdminTag}>
                <span className={styles.boldlabelAdminTag}>
                  Non Engagement Annual Review - Admin
                </span>
              </div>
            )}

            <div className="mainContainer">
              <div className="row mt30">
                <div className="col-md-6">
                  {!this.state["IsAdmin"] && (
                    <div className="form-controls">
                      <label className={styles.boldlabel}>Reviewee:</label>
                      <label className="text-left">
                        {this.props.user ? this.props.user.Title : ""}
                      </label>
                    </div>
                  )}
                  {this.state["IsAdmin"] && (
                    <div className="form-controls">
                      <label className={styles.boldlabel}>Reviewee:</label>
                      <div className={styles.divPeoplePicker}>
                        {
                          <PeoplePicker
                            context={this.props.AppContext}
                            personSelectionLimit={1}
                            groupName={""} // Leave this blank in case you want to filter from all users
                            showtooltip={true}
                            ensureUser={true}
                            showHiddenInUI={false}
                            principalTypes={[PrincipalType.User]}
                            onChange={this.onChangeRevieweeName}
                            defaultSelectedUsers={[
                              this.state["RevieweeNameEmail"],
                            ]}
                            resolveDelay={1000}
                          />
                        }
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="form-controls">
                    <label className={styles.boldlabel}>Fiscal Year:</label>
                    <Dropdown
                      options={this.state["allFiscalYear"]}
                      onChange={(e) => {
                        this.setState({ selectedFYYear: e["value"] });
                      }}
                      // onChange={this.onChange}
                      value={this.state["selectedFYYear"]}
                      placeholder="Select an option"
                    />
                  </div>
                </div>
              </div>

              <div className="row mt1">
                <div className="col-md-6">
                  <div className="form-controls">
                    <label className={styles.boldlabel}>Review Type:</label>
                    <Dropdown
                      options={this.state["ReviewTypeOptions"]}
                      onChange={(e) => {
                        this.setState({ selectedReviewType: e["value"] });
                      }}
                      value={this.state["selectedReviewType"]}
                      placeholder="Select an option"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-controls">
                    <label className={styles.boldlabel}>Role:</label>
                    <Dropdown
                      options={this.state["allRoles"]}
                      onChange={(e) => {
                        this.setState({ selectedRole: e["value"] });
                      }}
                      value={this.state["selectedRole"]}
                      placeholder="Select an option"
                    />
                  </div>
                </div>
              </div>
              <div className="dflex mt1 jc">
                <button
                  className="btn btn-primary"
                  onClick={() => this.saveData()}
                  disabled={
                    this.state["selectedRole"] == "" ||
                    this.state["selectedFYYear"] == "" ||
                    this.state["selectedReviewType"] == ""
                  }
                >
                  Start Review
                </button>

                <button
                  className="btn btn-outline-dark ml1"
                  onClick={() => this.cancel()}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Deva Changes start */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "30px 0px",
              }}
            >
              {/* {this.getAnnualReview()} */}
              <div>
                <div style={{ color: "red", fontWeight: 600 }}>
                  After you click Start Review, you will be taken back to the
                  TAG Performance Management landing page.
                </div>
                <div>
                  From there, to access & complete your Non-Engagement Review,
                  please go to{" "}
                  <span style={{ fontWeight: 600 }}>
                    Home / Reviewee / Non Engagement Reviews Where I Am The
                    Reviewee.
                  </span>
                </div>
              </div>
            </div>
            {/* Deva Changes end */}
          </div>
        )}

        {/* {(this.state["showAssigneeForm"]) && <div>
                    <RevieweeForm user={this.props.user} AppContext={this.props.AppContext}
                        ItemID={this.state["newItemResponse"].Id} />
                </div>} */}
        {!this.state["showAssigneeForm"] && (
          <div>
            <RevieweeForm
              user={this.props.user}
              AppContext={this.props.AppContext}
              ItemID={this.state["newItemResponse"].Id}
            />
          </div>
        )}
        <Dialog
          hidden={this.state["showModel"]}
          onDismiss={() => {
            this.setState({ showModel: true });
          }}
          dialogContentProps={dialogContentProps}
          // modalProps={modalProps}
        >
          <DialogFooter>
            <button
              className="btn btn-primary"
              onClick={() => this.showAssigneeForm()}
            >
              OK
            </button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
  public cancel = () => {
    //  window.location.href = this.webUrl + "/Lists/" + Config.ListNames.NonEngReview;
    window.location.href = this.webUrl;
  };
  private saveData = async () => {
    debugger;
    console.log("Calling save", this.state);
    let data = {};
    let fyYear = this.state["selectedFYYear"].value
      ? this.state["selectedFYYear"].value
      : this.state["selectedFYYear"];
    const columns = Config.NonEngagementReviewTemplateColumns;
    data[columns.FiscalYear] = this.state["selectedFYYear"].value
      ? this.state["selectedFYYear"].value
      : this.state["selectedFYYear"];
    data[columns.Role] = this.state["selectedRole"];
    data[columns.Submitted] = 99;
    data[columns.StatusReview] = "Awaiting Reviewee";
    if (this.state["IsAdmin"]) {
      data[columns.RevieweeId] = this.state["RevieweeName"].Id;

      if (this.state["selectedReviewType"] == "Year End") {
        data[columns.Title] =
          this.state["RevieweeName"].Title + " - Year End " + fyYear;
      } else {
        data[columns.Title] = this.props.user.Title;
      }
    } else {
      data[columns.RevieweeId] = this.props.user.Id;
      if (this.state["selectedReviewType"] == "Year End") {
        data[columns.Title] = this.props.user.Title + " - Year End " + fyYear;
      } else {
        data[columns.Title] = this.props.user.Title;
      }
    }

    data[columns.MentorId] = this.state["mentor"].Id;

    console.log(data);
    this.listItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.NonEngReview
    );
    let d1 = Date.now();
    let d = new Date(d1);
    let formattedDate =
      d.getMonth() +
      1 +
      "/" +
      d.getDate() +
      "/" +
      d.getFullYear() +
      " " +
      (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) +
      ":" +
      d.getMinutes() +
      " " +
      (d.getHours() >= 12 ? "PM" : "AM");
    data[columns.SignoffHistory] =
      "Reviewee Initiated - " + this.props.user.Title + " , " + formattedDate;
    //if (this.state.IsCreateMode) {
    // Creating item
    this.listItemService.createItem(data).then((res) => {
      console.log("showModel", res);
      this.setState({ newItemResponse: res.data });
      this.showAssigneeForm();
    });
    // }
    // else {
    // Updating item
    //  await this.listItemService.updateItem(this.props.ItemID, data);
    //}
  };
  // private showAssigneeForm = () => {
  //     // this.setState({ showModel: true });
  //     if (this.state["newItemResponse"][Config.NonEngagementReviewTemplateColumns.StatusReview] == "Awaiting Reviewee")
  //         this.setState({ showAssigneeForm: false });
  // }
  private showAssigneeForm = () => {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
  };
}
