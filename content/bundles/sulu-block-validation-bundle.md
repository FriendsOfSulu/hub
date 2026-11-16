---
title: SuluBlockValidationBundle
packageName: manuxi/sulu-block-validation-bundle
shortDescription: >-
  Makes Sulu Admin validation respect field and block visibility and disabled
  conditions, with optional expansion of blocks containing invalid fields.
license: MIT
githubMaintainer: manuxi
githubLink: 'https://github.com/manuxi/SuluBlockValidationBundle'
githubAvatar: 'https://avatars.githubusercontent.com/u/11303615?v=4'
githubStars: 0
totalDownloads: 17
targetSuluVersion: ^3.0
lastRepositoryUpdate: '2026-10-02T19:55:38Z'
categories:
  - form
  - dx
latestRelease: ''
---
Adjusts Sulu Admin validation so hidden or disabled mandatory fields and block entries do not prevent saving when their visibility and disabled conditions are supported. Visible and enabled fields retain their validation, and unsupported conditions retain the original required rules. Optional admin JavaScript expands collapsed blocks containing invalid fields after a failed save.
