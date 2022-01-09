#### 0.4.2 (2022-01-09)

##### New Features

- **filter-deploy-workflows:** filtering by semver regex tag version and branch initial release naming (#103) (21fb8f9f)
- **circleci-hold-deploy:** holding deploy workflow (#101) (59399af7)
- **circleci-continue-on-build-error:** build workflow should give us a typescript error and continue to deploy (#97) (b369e3a2)
- **circleci-defaults:** added default options for jobs like working_directory and executor (#95) (1b9dc3e8)
- **automatize-deploy:** job to automatize package deploy to npm (#91) (15fee50a)
- **create-release:** script to create release after new tag creation (#90) (37ec76e9)
- **create-pull-request:** function to create a new pull request (#89) (d60e2d1f)

##### Bug Fixes

- **circleci-deploy-workflow:** fixed branch regex (#99) (cf392e7a)
- **circleci-filter-typo:** fixed typo branchs (#93) (76e0492f)

##### Other Changes

- **version:** 0.4.2 (#86) (b029528d)

#### 0.4.2 (2022-01-08)

##### New Features

- **release-patch-script-tag:** add new tag to new release commit (#80) (d5ff5600)
- **release-patch-pull-request:** added pull request feature to release-patch script (#78) (27c76053)
- **release-patch:** scripts to automatize release (#73) (2bb7d002)
- **changelog:** added changelog file (#72) (d0f8c165)
- **prettier-tab-width:** tab width update (#71) (f220ed41)
- **readme-monorepo:** update with new partial example (#68) (51fa1453)

##### Bug Fixes

- **release-typo:** removing git function wrong usage (#83) (53a61289)
- **release:** fixed release script to push with tag, and removed old changelog (#82) (16570d6f)
- **prettier-types:** fixing prettier tab width and restore config type (#70) (c8197fe8)

##### Other Changes

- **version:**
  - 0.4.2 (#81) (22222d77)
  - 0.4.2 (#79) (5a5bca3a)
