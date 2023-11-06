import LoginPage from "../../../support/pageObjects/LoginPage";
import CandidatesPage from "../../../support/pageObjects/RecruitmentTab/CandidatesPage";
import vacanciesHelper from "../../../support/helpers/vacanciesHelper";
import candidatesHelper from "../../../support/helpers/candidatesHelper";
import pimHelper from "../../../support/helpers/pimHelper";
import commonHelper from "../../../support/helpers/commonHelper";

const loginPage: LoginPage = new LoginPage();
const candidatesPage: CandidatesPage = new CandidatesPage();


let employeeData: any = {};

describe("Recruitment: Candidates & Vacancies table data validation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.fixture("loginInfo").then((loginData: any) => {
      loginPage.login(loginData.userName.valid, loginData.password.valid);
    });

    cy.fixture("employeeInfo").then((empData) => {
      employeeData = empData;
    });
  });

  it("Recruitment - Candidates: Schedule an Interview for a Candidate", () => {
    pimHelper

      .addEmployee(employeeData)
      // Add a acancy
      .then((employeeResponse) => {
        return cy.fixture("vacancyInfo").then((vacancyData) => {
          return vacanciesHelper.addVacancy(
            vacancyData,
            employeeResponse.data.empNumber
          );
        });
      })
      // Add a candidate
      .then((vacancyResponse) => {
        return cy.fixture("candidateInfo").then((candidateData) => {
          return candidatesHelper.addCandidate(
            candidateData,
            vacancyResponse.data.id
          );
        });
      })
      // Shortlist the candidate and schedule an interview
      .then((candidateResponse) => {
        candidatesHelper.shortlistCandidate(candidateResponse.data.id);
        cy.visit(
          `/web/index.php/recruitment/addCandidate/${candidateResponse.data.id}`
        );
        candidatesPage.scheduleInterview(employeeData);
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

});
