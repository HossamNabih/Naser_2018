module.exports = function init(site) {

  let collection_name = 'eng_item_list'

 let source = {
    name : 'Stores System' ,
    ar : 'نظام المخازن'
  }

  let image_url = '/images/eng_item_list.png'
  let add_message = {name : 'New Eng Item Added' , ar : 'تم أضافة أذن صرف فنى جديد'}
  let update_message =  {name : ' Eng Item  updated' , ar : 'تم تعديل   أذن صرف فنى'}
  let delete_message =  {name : ' Eng Item  dleteted' , ar : 'تم حذف  أذن صرف فنى '}


  site.on('mongodb after insert', function (result) {
      if (result.collection === collection_name) {
        site.call('please monitor action' , { obj : {
          icon: image_url,
          source: source,
          message: add_message ,
          value: { name : result.doc.name , ar : result.doc.name},
          add: result.doc,
          action: 'add'
        }, result : result })
      }
  })

  site.on('mongodb after update', function (result) {
      if (result.collection === collection_name) {
        site.call('please monitor action' , { obj : {
          icon: image_url,
          source : source,
          message: update_message ,
          value: {name : result.old_doc.name , ar : result.old_doc.name},
          update: site.objectDiff(result.update.$set, result.old_doc),
          action: 'update'
        }, result : result })
      }
  })


  site.on('mongodb after delete', function (result) {
      if (result.collection === collection_name) {
        site.call('please monitor action' , { obj : {
          icon: image_url,
          source: source ,
          message: delete_message ,
          value: {name : result.doc.name , ar : result.doc.name},
          delete: result.doc,
          action: 'delete'
        }, result : result })
      }
  })

}