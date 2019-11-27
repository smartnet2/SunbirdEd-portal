window.H5PIntegration = parent.H5PIntegration || {
    "ajax": {
      "contentUserData": "",
      "setFinished": ""
    },
    "ajaxPath": "/h5p/ajax?action=",
    "editor": {
      "filesPath": "/h5p/temp-files",
      "fileIcon": {
        "path": "http://lumi.education/editor/images/binary-file.png",
        "width": 50,
        "height": 50
      },
      "ajaxPath": "/h5p/ajax?action=",
      "libraryUrl": "/h5p/editor/",
      "copyrightSemantics": {
        "name": "copyright",
        "type": "group",
        "label": "Copyright information",
        "fields": [
          {
            "name": "title",
            "type": "text",
            "label": "Title",
            "placeholder": "La Gioconda",
            "optional": true
          },
          {
            "name": "author",
            "type": "text",
            "label": "Author",
            "placeholder": "Leonardo da Vinci",
            "optional": true
          },
          {
            "name": "year",
            "type": "text",
            "label": "Year(s)",
            "placeholder": "1503 - 1517",
            "optional": true
          },
          {
            "name": "source",
            "type": "text",
            "label": "Source",
            "placeholder": "http://en.wikipedia.org/wiki/Mona_Lisa",
            "optional": true,
            "regexp": {
              "pattern": "^http[s]?://.+",
              "modifiers": "i"
            }
          },
          {
            "name": "license",
            "type": "select",
            "label": "License",
            "default": "U",
            "options": [
              {
                "value": "U",
                "label": "Undisclosed"
              },
              {
                "value": "CC BY",
                "label": "Attribution",
                "versions": [
                  {
                    "value": "4.0",
                    "label": "4.0 International"
                  },
                  {
                    "value": "3.0",
                    "label": "3.0 Unported"
                  },
                  {
                    "value": "2.5",
                    "label": "2.5 Generic"
                  },
                  {
                    "value": "2.0",
                    "label": "2.0 Generic"
                  },
                  {
                    "value": "1.0",
                    "label": "1.0 Generic"
                  }
                ]
              },
              {
                "value": "CC BY-SA",
                "label": "Attribution-ShareAlike",
                "versions": [
                  {
                    "value": "4.0",
                    "label": "4.0 International"
                  },
                  {
                    "value": "3.0",
                    "label": "3.0 Unported"
                  },
                  {
                    "value": "2.5",
                    "label": "2.5 Generic"
                  },
                  {
                    "value": "2.0",
                    "label": "2.0 Generic"
                  },
                  {
                    "value": "1.0",
                    "label": "1.0 Generic"
                  }
                ]
              },
              {
                "value": "CC BY-ND",
                "label": "Attribution-NoDerivs",
                "versions": [
                  {
                    "value": "4.0",
                    "label": "4.0 International"
                  },
                  {
                    "value": "3.0",
                    "label": "3.0 Unported"
                  },
                  {
                    "value": "2.5",
                    "label": "2.5 Generic"
                  },
                  {
                    "value": "2.0",
                    "label": "2.0 Generic"
                  },
                  {
                    "value": "1.0",
                    "label": "1.0 Generic"
                  }
                ]
              },
              {
                "value": "CC BY-NC",
                "label": "Attribution-NonCommercial",
                "versions": [
                  {
                    "value": "4.0",
                    "label": "4.0 International"
                  },
                  {
                    "value": "3.0",
                    "label": "3.0 Unported"
                  },
                  {
                    "value": "2.5",
                    "label": "2.5 Generic"
                  },
                  {
                    "value": "2.0",
                    "label": "2.0 Generic"
                  },
                  {
                    "value": "1.0",
                    "label": "1.0 Generic"
                  }
                ]
              },
              {
                "value": "CC BY-NC-SA",
                "label": "Attribution-NonCommercial-ShareAlike",
                "versions": [
                  {
                    "value": "4.0",
                    "label": "4.0 International"
                  },
                  {
                    "value": "3.0",
                    "label": "3.0 Unported"
                  },
                  {
                    "value": "2.5",
                    "label": "2.5 Generic"
                  },
                  {
                    "value": "2.0",
                    "label": "2.0 Generic"
                  },
                  {
                    "value": "1.0",
                    "label": "1.0 Generic"
                  }
                ]
              },
              {
                "value": "CC BY-NC-ND",
                "label": "Attribution-NonCommercial-NoDerivs",
                "versions": [
                  {
                    "value": "4.0",
                    "label": "4.0 International"
                  },
                  {
                    "value": "3.0",
                    "label": "3.0 Unported"
                  },
                  {
                    "value": "2.5",
                    "label": "2.5 Generic"
                  },
                  {
                    "value": "2.0",
                    "label": "2.0 Generic"
                  },
                  {
                    "value": "1.0",
                    "label": "1.0 Generic"
                  }
                ]
              },
              {
                "value": "GNU GPL",
                "label": "General Public License",
                "versions": [
                  {
                    "value": "v3",
                    "label": "Version 3"
                  },
                  {
                    "value": "v2",
                    "label": "Version 2"
                  },
                  {
                    "value": "v1",
                    "label": "Version 1"
                  }
                ]
              },
              {
                "value": "PD",
                "label": "Public Domain",
                "versions": [
                  {
                    "value": "-",
                    "label": "-"
                  },
                  {
                    "value": "CC0 1.0",
                    "label": "CC0 1.0 Universal"
                  },
                  {
                    "value": "CC PDM",
                    "label": "Public Domain Mark"
                  }
                ]
              },
              {
                "value": "C",
                "label": "Copyright"
              }
            ]
          },
          {
            "name": "version",
            "type": "select",
            "label": "License Version",
            "options": []
          }
        ]
      },
      "metadataSemantics": [
        {
          "name": "title",
          "type": "text",
          "label": "Title",
          "placeholder": "La Gioconda"
        },
        {
          "name": "license",
          "type": "select",
          "label": "License",
          "default": "U",
          "options": [
            {
              "value": "U",
              "label": "Undisclosed"
            },
            {
              "type": "optgroup",
              "label": "Creative Commons",
              "options": [
                {
                  "value": "CC BY",
                  "label": "Attribution (CC BY)",
                  "versions": [
                    {
                      "value": "4.0",
                      "label": "4.0 International"
                    },
                    {
                      "value": "3.0",
                      "label": "3.0 Unported"
                    },
                    {
                      "value": "2.5",
                      "label": "2.5 Generic"
                    },
                    {
                      "value": "2.0",
                      "label": "2.0 Generic"
                    },
                    {
                      "value": "1.0",
                      "label": "1.0 Generic"
                    }
                  ]
                },
                {
                  "value": "CC BY-SA",
                  "label": "Attribution-ShareAlike (CC BY-SA)",
                  "versions": [
                    {
                      "value": "4.0",
                      "label": "4.0 International"
                    },
                    {
                      "value": "3.0",
                      "label": "3.0 Unported"
                    },
                    {
                      "value": "2.5",
                      "label": "2.5 Generic"
                    },
                    {
                      "value": "2.0",
                      "label": "2.0 Generic"
                    },
                    {
                      "value": "1.0",
                      "label": "1.0 Generic"
                    }
                  ]
                },
                {
                  "value": "CC BY-ND",
                  "label": "Attribution-NoDerivs (CC BY-ND)",
                  "versions": [
                    {
                      "value": "4.0",
                      "label": "4.0 International"
                    },
                    {
                      "value": "3.0",
                      "label": "3.0 Unported"
                    },
                    {
                      "value": "2.5",
                      "label": "2.5 Generic"
                    },
                    {
                      "value": "2.0",
                      "label": "2.0 Generic"
                    },
                    {
                      "value": "1.0",
                      "label": "1.0 Generic"
                    }
                  ]
                },
                {
                  "value": "CC BY-NC",
                  "label": "Attribution-NonCommercial (CC BY-NC)",
                  "versions": [
                    {
                      "value": "4.0",
                      "label": "4.0 International"
                    },
                    {
                      "value": "3.0",
                      "label": "3.0 Unported"
                    },
                    {
                      "value": "2.5",
                      "label": "2.5 Generic"
                    },
                    {
                      "value": "2.0",
                      "label": "2.0 Generic"
                    },
                    {
                      "value": "1.0",
                      "label": "1.0 Generic"
                    }
                  ]
                },
                {
                  "value": "CC BY-NC-SA",
                  "label": "Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)",
                  "versions": [
                    {
                      "value": "4.0",
                      "label": "4.0 International"
                    },
                    {
                      "value": "3.0",
                      "label": "3.0 Unported"
                    },
                    {
                      "value": "2.5",
                      "label": "2.5 Generic"
                    },
                    {
                      "value": "2.0",
                      "label": "2.0 Generic"
                    },
                    {
                      "value": "1.0",
                      "label": "1.0 Generic"
                    }
                  ]
                },
                {
                  "value": "CC BY-NC-ND",
                  "label": "Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)",
                  "versions": [
                    {
                      "value": "4.0",
                      "label": "4.0 International"
                    },
                    {
                      "value": "3.0",
                      "label": "3.0 Unported"
                    },
                    {
                      "value": "2.5",
                      "label": "2.5 Generic"
                    },
                    {
                      "value": "2.0",
                      "label": "2.0 Generic"
                    },
                    {
                      "value": "1.0",
                      "label": "1.0 Generic"
                    }
                  ]
                },
                {
                  "value": "CC0 1.0",
                  "label": "Public Domain Dedication (CC0)"
                },
                {
                  "value": "CC PDM",
                  "label": "Public Domain Mark (PDM)"
                }
              ]
            },
            {
              "value": "GNU GPL",
              "label": "General Public License v3"
            },
            {
              "value": "PD",
              "label": "Public Domain"
            },
            {
              "value": "ODC PDDL",
              "label": "Public Domain Dedication and Licence"
            },
            {
              "value": "C",
              "label": "Copyright"
            }
          ]
        },
        {
          "name": "licenseVersion",
          "type": "select",
          "label": "License Version",
          "options": [
            {
              "value": "4.0",
              "label": "4.0 International"
            },
            {
              "value": "3.0",
              "label": "3.0 Unported"
            },
            {
              "value": "2.5",
              "label": "2.5 Generic"
            },
            {
              "value": "2.0",
              "label": "2.0 Generic"
            },
            {
              "value": "1.0",
              "label": "1.0 Generic"
            }
          ],
          "optional": true
        },
        {
          "name": "yearFrom",
          "type": "number",
          "label": "Years (from)",
          "placeholder": "1991",
          "min": "-9999",
          "max": "9999",
          "optional": true
        },
        {
          "name": "yearTo",
          "type": "number",
          "label": "Years (to)",
          "placeholder": "1992",
          "min": "-9999",
          "max": "9999",
          "optional": true
        },
        {
          "name": "source",
          "type": "text",
          "label": "Source",
          "placeholder": "https://",
          "optional": true
        },
        {
          "name": "authors",
          "type": "list",
          "field": {
            "name": "author",
            "type": "group",
            "fields": [
              {
                "label": "Author's name",
                "name": "name",
                "optional": true,
                "type": "text"
              },
              {
                "name": "role",
                "type": "select",
                "label": "Author's role",
                "default": "Author",
                "options": [
                  {
                    "value": "Author",
                    "label": "Author"
                  },
                  {
                    "value": "Editor",
                    "label": "Editor"
                  },
                  {
                    "value": "Licensee",
                    "label": "Licensee"
                  },
                  {
                    "value": "Originator",
                    "label": "Originator"
                  }
                ]
              }
            ]
          }
        },
        {
          "name": "licenseExtras",
          "type": "text",
          "widget": "textarea",
          "label": "License Extras",
          "optional": true,
          "description": "Any additional information about the license"
        },
        {
          "name": "changes",
          "type": "list",
          "field": {
            "name": "change",
            "type": "group",
            "label": "Changelog",
            "fields": [
              {
                "name": "date",
                "type": "text",
                "label": "Date",
                "optional": true
              },
              {
                "name": "author",
                "type": "text",
                "label": "Changed by",
                "optional": true
              },
              {
                "name": "log",
                "type": "text",
                "widget": "textarea",
                "label": "Description of change",
                "placeholder": "Photo cropped, text changed, etc.",
                "optional": true
              }
            ]
          }
        },
        {
          "name": "authorComments",
          "type": "text",
          "widget": "textarea",
          "label": "Author comments",
          "description": "Comments for the editor of the content (This text will not be published as a part of copyright info)",
          "optional": true
        },
        {
          "name": "contentType",
          "type": "text",
          "widget": "none"
        }
      ],
      "assets": {
        "css": [
          "/h5p/core/styles/h5p.css",
          "/h5p/core/styles/h5p-confirmation-dialog.css",
          "/h5p/core/styles/h5p-core-button.css",
          "/h5p/editor/libs/darkroom.css",
          "/h5p/editor/styles/css/h5p-hub-client.css",
          "/h5p/editor/styles/css/fonts.css",
          "/h5p/editor/styles/css/application.css",
          "/h5p/editor/styles/css/libs/zebra_datepicker.min.css"
        ],
        "js": [
          "/h5p/core/js/jquery.js",
          "/h5p/core/js/h5p.js",
          "/h5p/core/js/h5p-event-dispatcher.js",
          "/h5p/core/js/h5p-x-api-event.js",
          "/h5p/core/js/h5p-x-api.js",
          "/h5p/core/js/h5p-content-type.js",
          "/h5p/core/js/h5p-confirmation-dialog.js",
          "/h5p/core/js/h5p-action-bar.js",
          "/h5p/editor/scripts/h5p-hub-client.js",
          "/h5p/editor/scripts/h5peditor.js",
          "/h5p/editor/language/en.js",
          "/h5p/editor/scripts/h5peditor-semantic-structure.js",
          "/h5p/editor/scripts/h5peditor-library-selector.js",
          "/h5p/editor/scripts/h5peditor-form.js",
          "/h5p/editor/scripts/h5peditor-text.js",
          "/h5p/editor/scripts/h5peditor-html.js",
          "/h5p/editor/scripts/h5peditor-number.js",
          "/h5p/editor/scripts/h5peditor-textarea.js",
          "/h5p/editor/scripts/h5peditor-file-uploader.js",
          "/h5p/editor/scripts/h5peditor-file.js",
          "/h5p/editor/scripts/h5peditor-image.js",
          "/h5p/editor/scripts/h5peditor-image-popup.js",
          "/h5p/editor/scripts/h5peditor-av.js",
          "/h5p/editor/scripts/h5peditor-group.js",
          "/h5p/editor/scripts/h5peditor-boolean.js",
          "/h5p/editor/scripts/h5peditor-list.js",
          "/h5p/editor/scripts/h5peditor-list-editor.js",
          "/h5p/editor/scripts/h5peditor-library.js",
          "/h5p/editor/scripts/h5peditor-library-list-cache.js",
          "/h5p/editor/scripts/h5peditor-select.js",
          "/h5p/editor/scripts/h5peditor-selector-hub.js",
          "/h5p/editor/scripts/h5peditor-selector-legacy.js",
          "/h5p/editor/scripts/h5peditor-dimensions.js",
          "/h5p/editor/scripts/h5peditor-coordinates.js",
          "/h5p/editor/scripts/h5peditor-none.js",
          "/h5p/editor/scripts/h5peditor-metadata.js",
          "/h5p/editor/scripts/h5peditor-metadata-author-widget.js",
          "/h5p/editor/scripts/h5peditor-metadata-changelog-widget.js",
          "/h5p/editor/scripts/h5peditor-pre-save.js",
          "/h5p/editor/ckeditor/ckeditor.js"
        ]
      },
      "deleteMessage": "Are you sure you wish to delete this content?",
      "apiVersion": {
        "majorVersion": 1,
        "minorVersion": 24
      }
    },
    "hubIsEnabled": true,
    "l10n": {
      "H5P": {
        "fullscreen": "Fullscreen",
        "disableFullscreen": "Disable fullscreen",
        "download": "Download",
        "copyrights": "Rights of use",
        "embed": "Embed",
        "size": "Size",
        "showAdvanced": "Show advanced",
        "hideAdvanced": "Hide advanced",
        "advancedHelp": "Include this script on your website if you want dynamic sizing of the embedded content:",
        "copyrightInformation": "Rights of use",
        "close": "Close",
        "title": "Title",
        "author": "Author",
        "year": "Year",
        "source": "Source",
        "license": "License",
        "thumbnail": "Thumbnail",
        "noCopyrights": "No copyright information available for this content.",
        "downloadDescription": "Download this content as a H5P file.",
        "copyrightsDescription": "View copyright information for this content.",
        "embedDescription": "View the embed code for this content.",
        "h5pDescription": "Visit H5P.org to check out more cool content.",
        "contentChanged": "This content has changed since you last used it.",
        "startingOver": "You'll be starting over.",
        "by": "by",
        "showMore": "Show more",
        "showLess": "Show less",
        "subLevel": "Sublevel",
        "confirmDialogHeader": "Confirm action",
        "confirmDialogBody": "Please confirm that you wish to proceed. This action is not reversible.",
        "cancelLabel": "Cancel",
        "confirmLabel": "Confirm",
        "licenseU": "Undisclosed",
        "licenseCCBY": "Attribution",
        "licenseCCBYSA": "Attribution-ShareAlike",
        "licenseCCBYND": "Attribution-NoDerivs",
        "licenseCCBYNC": "Attribution-NonCommercial",
        "licenseCCBYNCSA": "Attribution-NonCommercial-ShareAlike",
        "licenseCCBYNCND": "Attribution-NonCommercial-NoDerivs",
        "licenseCC40": "4.0 International",
        "licenseCC30": "3.0 Unported",
        "licenseCC25": "2.5 Generic",
        "licenseCC20": "2.0 Generic",
        "licenseCC10": "1.0 Generic",
        "licenseGPL": "General Public License",
        "licenseV3": "Version 3",
        "licenseV2": "Version 2",
        "licenseV1": "Version 1",
        "licensePD": "Public Domain",
        "licenseCC010": "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication",
        "licensePDM": "Public Domain Mark",
        "licenseC": "Copyright",
        "contentType": "Content Type",
        "licenseExtras": "License Extras",
        "changes": "Changelog"
      }
    },
    "postUserStatistics": false,
    "saveFreq": false,
    "url": "/h5p",
    "user": {
      "mail": "",
      "name": ""
    }
  }