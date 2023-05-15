#### 0.4.3 (2023-05-15)

##### Build System / Dependencies

- **deps-dev:**
  - bump @babel/core from 7.14.6 to 7.21.8 (#122) (8d469365)
  - bump @rollup/plugin-commonjs from 20.0.0 to 25.0.0 (#136) (4b0c3aac)
  - bump @rollup/plugin-node-resolve from 13.0.4 to 15.0.2 (#124) (01e5c8e5)
  - bump @typescript-eslint/eslint-plugin (#121) (8d6b8582)
  - bump eslint-plugin-jest from 24.3.6 to 27.2.1 (#133) (b5018afe)
  - bump @babel/cli from 7.14.5 to 7.21.5 (#135) (330f2da9)
  - bump rollup from 2.56.3 to 2.79.1 (#139) (f7260cf6)
  - bump lint-staged from 11.0.0 to 13.2.2 (#131) (2f3276c7)
  - bump typescript from 4.2.3 to 5.0.4 (#132) (bed19e93)
  - bump eslint from 7.29.0 to 7.32.0 (#126) (424ea2c6)
  - bump @babel/plugin-transform-modules-commonjs (#127) (2f728a88)
  - bump @typescript-eslint/parser from 4.18.0 to 4.33.0 (#129) (8440f13f)
  - bump prettier from 2.2.1 to 2.8.8 (#120) (9645da63)
  - bump babel-jest from 26.6.3 to 29.5.0 (#119) (80eac14b)
  - bump @rollup/plugin-babel from 5.3.0 to 6.0.3 (#123) (1efc0436)
- **deps:**
  - bump yup from 0.32.9 to 1.1.1 (#137) (6ebece43)
  - bump yargs and @types/yargs (#138) (63ef2929)
  - bump cosmiconfig from 7.0.0 to 8.1.3 (#134) (4887b697)

##### New Features

- **restore-values:** added defaultValues and defaultSingValues to restore (#142) (cc328645)
- **restorer-default-values:** added default values input on restorer to change values during restore process (#141) (3f34d966)
- **rollup:** upgrading rollup version (#140) (d9869610)
- **dependabot:** added dependabot yml file to automate the dependencies updates (#118) (6bc63f4b)
- **test-observability:** added logs to connect memory database (#116) (1765c13c)
- **chunk-restore:** added insertMany docs in restore by chunk (#112) (ec7273ec)
- **eslint:** added no-unused-expressions rule (#111) (5642129e)

##### Bug Fixes

- **dependabot-ecosystem:** npm (#130) (7efbbeea)
- **dependabot:** yarn package ecosystem (#125) (8b24eaa2)
- **build:** removed prebuild script (#117) (e07f5561)
- **mongo-memory-server:** updated mongo memory server (#115) (02f46856)
- **circleci:** fixing executor node version (#113) (9c26bd7d)

##### Other Changes

- **circleci:** fixing executor node version (#113)" (#114) (8bda714a)
- **version:** 0.4.3 (#110) (006bfc5d)

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

- **build-and-deploy:** removed tsc generation to properly deploy (#108) (b4023d23)
- **circleci-build-job:** fixing broken build job (#107) (67b69e45)
- **removing-tag-validation:** removed tag validation not permitting release (#105) (398b3558)
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
