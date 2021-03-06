module.exports = {
    _id : '_design/control',
    views : {
        by_type : {
            map : function(doc) {
                if (doc.type) emit(doc.type, doc.state)
            }.toString()
        },
        channelsByApp : {
          map : function(doc) {
            if (doc.type == 'channel' && doc.app_id) {
              emit(doc.app_id)
            }
          }.toString()
        },
        channelsByUserAndName : {
          map : function(doc) {
            if (doc.type == 'channel' && doc.owner_id) {
              emit([doc.owner_id, doc.name])
            }
          }.toString()
        },
        channelsByOwnerAndState : {
          map : function(doc) {
            if (doc.type == 'channel' && doc.state && doc.owner_id) {
              emit([doc.owner_id, doc.state], doc.name);
            }
          }.toString()
        }
    }
}