# Promised Trello

Small wrapper for node-trello that uses promises and self explaining functions
to access the API.

Right now there are only GET-functions available, but I will add more.

## Install

```
npm install promised-trello
```

## Example
```
var Trello = require('promised-trello');

var t = new Trello(<key>, <token>);

t.getMyBoards().then(function(data) {
  console.log(JSON.stringify(data));
})
.catch(function (error) {
    // Handle any error from all above steps
    console.log('Error:');
    console.log(error);
})
.done();
```

### `getBoardByName(name)`

Get a single board by name, returns FALSE if no board with input name is found.

### `getMyBoards`

Get all boards for the authenticated user.

### `getBoard(id)`

Get a board by board ID.

### `getLists(id)`

Get all lists on a board by board ID.

### `getCards(id)`

Get all cards on a list by list ID.

### `getAttachments(id)`

Get all attachments on a card by card ID.

### `getFullBoard(name)`

Get a board with lists, cards and attachments by name.