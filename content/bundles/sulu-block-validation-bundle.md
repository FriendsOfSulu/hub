---
title: SuluBlockValidationBundle
packageName: manuxi/sulu-block-validation-bundle
shortDescription: Makes Sulu Admin validation respect field and block visibility and disabled conditions, with optional expansion of blocks containing invalid fields.
license: MIT
githubMaintainer: manuxi
githubLink: "https://github.com/manuxi/SuluBlockValidationBundle"
githubAvatar: ""
githubStars: 0
totalDownloads: 0
latestRelease: ""
targetSuluVersion: "^3.0"
lastRepositoryUpdate: "1970-01-01T00:00:00.000Z"
categories: [form, dx]
---
Adjusts Sulu Admin validation so hidden or disabled mandatory fields and block entries do not prevent saving when their visibility and disabled conditions are supported. Visible and enabled fields retain their validation, and unsupported conditions retain the original required rules. Optional admin JavaScript expands collapsed blocks containing invalid fields after a failed save.
