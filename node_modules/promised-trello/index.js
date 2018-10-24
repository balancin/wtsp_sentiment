var Q = require('q');
var Trello = require('node-trello');

var TrelloPromise = module.exports = function (key, token) {
  this.trello = new Trello(key, token);
};

// !Boards:

/**
 * Find a specific board by name.
 */
TrelloPromise.prototype.getBoardByName = function (name) {
  var deferred = Q.defer();
  this.trello.get('/1/search', {
    query: name,
    modelTypes: 'boards',
    board_fields: 'all'
  }, function(err, data) {
    if (err) {
      deferred.reject(new Error(err));
    }
    else {
      if (data.boards.length > 0) {
        deferred.resolve(data.boards[0]); 
      }
      else {
        deferred.resolve(false); 
      }
    }
  });
  return deferred.promise;
};

/**
 * Get my boards.
 */
TrelloPromise.prototype.getMyBoards = function () {
  var deferred = Q.defer();
  this.trello.get('/1/members/me/boards', function(err, data) {
    if (err) {
      deferred.reject(new Error(err));
    }
    else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

/**
 * Get a single board.
 */
TrelloPromise.prototype.getBoard = function (id) {
  var deferred = Q.defer();
  this.trello.get('/1/boards/' + id, function(err, data) {
    if (err) {
      deferred.reject(new Error(err));
    }
    else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};


// !Lists:

/**
 * Get all lists for a board.
 */
TrelloPromise.prototype.getLists = function (id, options) {
  var deferred = Q.defer();

  if (typeof options == 'undefined') {
    var options = {};
  }

  this.trello.get('/1/boards/' + id + '/lists', options, function(err, data) {
    if (err) {
      deferred.reject(new Error(err));
    }
    else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

// !Cards:

/**
 * Get all cards for a list.
 */
TrelloPromise.prototype.getCards = function (id, options) {
  var deferred = Q.defer();

  if (typeof options == 'undefined') {
    var options = {};
  }

  this.trello.get('/1/lists/' + id + '/cards', options, function(err, data) {
    if (err) {
      deferred.reject(new Error(err));
    }
    else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

/**
 * Get attachments for a card.
 */
TrelloPromise.prototype.getAttachments = function (id) {
  var deferred = Q.defer();

  this.trello.get('/1/cards/' + id + '/attachments', function(err, data) {
    if (err) {
      deferred.reject(new Error(err));
    }
    else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};


// !Specials:

/**
 * Get a single board with all lists, cards and attachments.
 */
TrelloPromise.prototype.getFullBoard = function(name) {
  var self = this;

  return self.getBoardByName(name).then(function(board) {
    return self.getLists(board.id).then(function(lists) {
      board.lists = lists;

      var promises = [];

      board.lists.forEach(function(list, n) {
        promises.push(self.getCards(list.id, {
          attachments: true
        }));
      });

      return Q.all(promises).then(function(cardlists) {
        cardlists.forEach(function(list) {
          if (list.length > 0) {
            // Add list to board.lists.
            var i = board.lists.findIndex(function(el) {
              if (el.id == list[0].idList) {
                return el;
              }
              else {
                return false;
              }
            });
            board.lists[i].cards = list;
          }
        });

        return board;
      });
    });
  })
  .then(function(board) {
    return board;
  });

};


// !Helpers:

