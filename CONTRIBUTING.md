# Where to Start

To know the process of creation and more please first read [our Wiki](https://gitlab.com/ldso18-19/t4g3/wikis/home).

# The code

This project's structure is organized by having feature-first approach in mind.

For new app features, try to keep it as feature-based folder in `./src/app/pages`.
Things in common such as common styles or components can be kept in `./src/app/common` directory.
Don't forget to export the new feature in `./src/app/pages/index.js` and to include it in `.src/app/routes.js`.

New api routes should be stored in `.src/api/routers` and don't forget to include them in `.src/api/routers/index.js`.

# Submitting an Issue

When submitting an Issue please follow our label design.

## Subject labels

Subject labels are labels that define what area or feature this issue hits. They are not always necessary, but very convenient.

Examples of subject labels are ~authentication, ~management, ~purchases, ~search.

If you are an expert in a particular area, it makes it easier to find issues to work on.

## Priority labels

Priority labels help us define the time a ~bug fix should be completed. Priority determines how quickly the defect turnaround time must be.
If there are multiple defects, the priority decides which defect has to be fixed immediately versus later.
This label documents the planned timeline & urgency on delivering ~bug fixes.

| Label | Meaning         | Defect SLA (applies only to ~bug and ~security defects)                    |
|-------|-----------------|----------------------------------------------------------------------------|
| ~P1   | Urgent Priority | The current release + potentially immediate hotfix (15 days) |
| ~P2   | High Priority   | The next release (30 days)                                                 |
| ~P3   | Medium Priority | Within the next 3 releases (approx one quarter or 45 days)                 |
| ~P4   | Low Priority    | Anything outside the next 3 releases (more than 60 days)   |

If an issue seems to fall between two priority labels, assign it to the higher-
priority label.
