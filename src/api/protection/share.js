var shareOptions = {
  user: [
    'username',
    'id'
  ],
  project: [
    'accessible',
    'description',
    'editable',
    'createdAt',
    'folderName',
    'id',
    'name',
    'owner',
    'updatedAt',
    'lat',
    'lng',
    'zoom'
  ],
  tag: [
    'name',
    'id',
    'createdAt',
    'updatedAt'
  ]
};

module.exports.createUser = function(user) {
  var toReturn = {};
  for (var i in shareOptions.user) {
    toReturn[shareOptions.user[i]] = user[shareOptions.user[i]];
  }
  if (user.ProjectUsers) {
    toReturn.role = user.ProjectUsers.role;
  }
  return toReturn;
};

module.exports.createProject = function(project) {
  var toReturn = {};
  for (var i in shareOptions.project) {
    toReturn[shareOptions.project[i]] = project[shareOptions.project[i]];
  }
  return toReturn;
};

module.exports.createTag = function(tag) {
  var toReturn = {};
  for (var i in shareOptions.tag) {
    toReturn[shareOptions.tag[i]] = tag[shareOptions.tag[i]];
  }
  return toReturn;
};
