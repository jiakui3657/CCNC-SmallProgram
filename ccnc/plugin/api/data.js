var data = 'init data'

function getData() {
  return data
}

function setData(value) {
  data = value
}

var url = 'https://test.wangtang.com.cn/hormone/rest'


module.exports = {
  getData: getData,
  setData: setData,
  url:url
}