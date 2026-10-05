module.exports = {
  packagerConfig: {
    "name": "SpinGo",
    "icon": "electron/favicon/favicon.ico",
    "asar": true
  },
  makers: [
    {
      name: '@electron-forge/maker-zip'
    }
  ]
};