import {Dimensions,Platform} from 'react-native';
const {height, width} = Dimensions.get('window');

const w = width>height ? width : height;
const h = width>height ? height : width;

module.exports = {
  container: {flex: 1,backgroundColor:'#F1F2F5'},
  wrapper: {width,height,backgroundColor:'#F1F2F5'},
  wrapSetting: {width,height,backgroundColor:'#F1F2F5',position:'absolute',zIndex:9999,top:0,left:0},
  bgImg : {
    width,height,position: 'absolute',justifyContent: 'center',alignItems: 'center',alignSelf: 'stretch',resizeMode: 'stretch',
  },
  btnScrollTop:{position:'absolute',zIndex:999,bottom:10,right:10},
  clockTime : {
    width,height,backgroundColor: '#F1F2F5',justifyContent: 'center',alignSelf: 'center'
  },
  bedtimeText: {
    color: '#2E3B51',marginLeft: 3,fontSize: 16,
  },
  wakeText: {
    color: '#2E3B51',marginLeft: 3,fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  time: {
    alignItems: 'center',
    flex: 1,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    color: '#2E3B51',
    fontSize: 35,
    fontWeight: "300",
  },
  sleepTimeContainer: {
    flex: 1,justifyContent: 'center',
    position: 'absolute',
    top: 0,bottom: 0,left: 0,right: 0
  },
  favIC:{width:22,height:21,marginRight:2},
  marRight:{marginRight:10},
  line:{borderBottomWidth:1,borderBottomColor:'#E3E4E8',width},
  marTop15:{marginTop:15},
  marTop10:{marginTop:10},
  pad15:{padding:15,width,alignItems:'center'},
  actionSheetRadius:{borderRadius:5},
  actionSheetContent:{width:width-30,backgroundColor:'#fff',alignItems:'center',overflow:'hidden'},
  actionSheetWrap:{justifyContent:'flex-end',paddingBottom: Platform.OS==='ios' ? 20 : 50,alignItems:'center',position:'absolute',zIndex:999,backgroundColor:'rgba(0,0,0,0.5)',width,height},
  closeCollection:{position:'absolute',top:5,right:5},
  popup:{flexDirection:'row',width:45,justifyContent:'space-between'},
  btnInfo:{width:45,height:30,borderColor:'#E1E7ED',borderWidth:1,borderRadius:5,alignItems:'center',justifyContent:'space-between',padding:5,flexDirection:'row'},
  btnYInfo:{width:65,height:30,borderColor:'#E1E7ED',borderWidth:1,borderRadius:5,alignItems:'center',justifyContent:'space-between',padding:5,flexDirection:'row'},
  headStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 27 : 10, alignItems: 'center',height: 110,
      position:'relative',zIndex:5,
  },
  headLocationStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 75,
      position:'relative',zIndex:5,
  },
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },

  wrapFilter:{
    alignItems:'center',marginTop:15,
    marginBottom:15,
  },
  filterFrame:{width:width-40,justifyContent:'space-between',alignItems:'center',flexDirection:'row'},
  inputSearch : {
    marginTop: 3,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
  btnMapLoc:{bottom:122,},
  btnMapZoom:{bottom:50,},
  btnMapFull:{bottom:10,},
  btnZoom:{padding:3},
  btnList:{top:10},
  btnMap:{position:'absolute',right:10,backgroundColor:'rgba(250,250,250,0.8)',padding:1,justifyContent:'center',alignItems:'center'},
  widthSubType:{width:(width-60),},
  widthLoc:{width:(width-60)/3,},
  //widthSearch:{width:(width-60)/3},
  widthBuySell:{width:(width-60)/2,},
  selectBoxBuySell:{
    backgroundColor:'#fff',
    borderRadius:4,
    borderColor:'#CED0D5',
    borderWidth:1,
    flexDirection:'row',
    justifyContent:'space-between',
    padding:10,
  },
  optionListLoc:{
    backgroundColor:'#fff',
    borderColor:'transparent',
    position:'absolute',width: 55,  height:60,
    top:Platform.OS ==='ios' ? 48 : 35,left:10,
  },OptionItemLoc:{
    paddingTop: 7,paddingBottom: 0,marginTop: 0,marginBottom: 0,
  },

  padLoc:{padding:20,},
  wrapListLoc:{
    backgroundColor:'#fff',
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#ddd',
    shadowOpacity: .5,
    minHeight: height-50,
    paddingBottom:50,
  },
  titleSubCat:{
    fontSize:20,
    padding:20
  },
  wrapFlatList:{
    paddingLeft:20,
    paddingBottom:150,
  },
  txtTitleOverCat:{color:'#2F353F',fontSize:18,marginBottom:0,maxHeight:50,overflow:'hidden'},
  txtAddrOverCat:{
    color:'#6587A8',fontSize:14,marginBottom:7,overflow: 'hidden'
  },
  flatlistItemCat:{
    justifyContent:'space-between',
    flexDirection:'row',
    marginBottom:20,
  },

  flatItemLoc:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingBottom:20,
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},

  wrapDistribute:{
    width:width-20,borderRadius:5,backgroundColor:'#fff',minHeight:height,
    flexDirection:'row',
    //paddingBottom: Platform.OS==='ios' ? 80 : 40,
  },
  shadown:{
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#999',
    shadowOpacity: .5,
  },
  flatItem:{
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:'#E3E4E8',
    borderRightWidth:1,
    borderRightColor:'#E3E4E8',
    width:(width-24)/3,
    padding:10,
    paddingTop:20,
  },
  flatlistItem:{
    width:(width-20),
    //flexDirection:'row',
    //marginBottom:Platform.OS==='ios' ? 55 : 125,
  },
  imgFlatItem:{
    marginRight:10,
    width:110,height:90,
  },
  imgFlatItemLoc:{
    //borderRadius:40,
    width:70,height:70,
    marginBottom:5,
  },
  wrapFlatRight:{

  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  imgLogoTop : {
      width: 138,height: 25,
  },
  imgContent : {
      width: 65,height: 65,marginBottom:10,
  },
  square:{
    width:300,
    height:360,
    alignItems:'center',
    justifyContent:'center',
  },
  wrapCircle:{
    position:'absolute',flex:1,alignItems:'center',
  },
  rowItem:{flexDirection: 'row',alignItems:'center'},
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    //backgroundColor:'#2e3c52',
    minWidth:width/6,
    alignItems:'center',
    height:28,
    paddingRight:4,
  },

  marTop:{marginTop: 15},
  logoCenter:{top:120},
  btnPress: {
    padding:15,
    borderRadius : 5,
    minWidth: width/3,
    borderWidth: 1,
    borderColor : "#D0021B",
    alignItems:'center'
  },
  colorNext : {
    color: '#D0021B',
    textAlign: 'center',
  },
  wrapContent :{
    //flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width,height:Platform.OS==='ios' ? height-200 : height-230
  },
  labelCat :{
    backgroundColor:'transparent',textAlign:'center',position:'relative'
  },
  labelNum :{
    backgroundColor:'transparent',zIndex:9,position:'absolute',color:'#d0021b',top:0,right:0
  },
  wrapIcRight:{
    width:55,justifyContent: 'space-between',flexDirection: 'row',marginTop: 7,
  },
  imgWidthGoogle : {width: 25,height: 16,marginRight:2},
  imgShare : {
      width: 16,height: 16,
  },
  imgInfo : {
      width: 20,height: 20,
  },
  imgSocial : {
      width: 21,height: 23,
  },
  selectBox : {
    width:48,borderColor:'transparent',position:'relative',paddingRight:0,paddingTop:5,
  },
  optionListStyle :{
    backgroundColor:'#fff',borderColor:'transparent',position:'absolute',width: 55,  height:60,
    top:Platform.OS ==='ios' ? 48 : 35,right:10,zIndex:9
  },
  optionUnitStyle :{
    borderColor:'transparent',position:'absolute',
    top:Platform.OS ==='ios' ? 460 : 485 ,right:15,zIndex:9,alignItems:'center'
  },
  OptionItem : {
    paddingTop: 7,paddingBottom: 0,marginTop: 0,marginBottom: 0,
  },
  plusStyle :{bottom:40,position:'absolute',right:10,
  },
  imgPlusStyle:{
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#999',
    shadowOpacity: .2,
    width:65,height:65,
  },
  popover : {
    paddingTop: Platform.OS ==='ios' ? 55 :40,
    alignItems:'center',
    position:'absolute',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:5,
  },

  padCreate:{ paddingTop: 165},
  padBuySell:{ paddingTop: 120},
  popoverLoc : {
    alignItems:'center',
    position:'absolute',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:8,
  },
  popoverShare : {
    paddingTop: Platform.OS ==='ios' ? 55 :40,
    position:'absolute',
    alignItems:'flex-end',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:5,
  },
  popoverCreate : {
    paddingBottom: Platform.OS ==='ios' ? 95 :150,
    paddingRight:10,
    position:'absolute',
    alignItems:'flex-end',
    justifyContent:'flex-end',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:5,
  },
  imgUpHome:{width: 14,height: 7,top:Platform.OS ==='ios' ? 55 :41,position:'absolute'},
  overLayoutShare:{
    backgroundColor:'#fff',width: 130,borderRadius:4,overflow:'hidden',top:7,right:10,paddingBottom:Platform.OS==='ios' ? 0 : 10,
  },
  itemCreate:{marginBottom:10,backgroundColor:'#fff',width: 150,padding:15,borderRadius:5,alignItems:'center'},
  overLayout:{
    backgroundColor:'#fff',width: width-20,borderRadius:6,overflow:'hidden',top:7,
    maxHeight:Platform.OS ==='ios' ? 350 : 380,
    //position:'absolute',zIndex:999,
  },
  overLayoutCat:{
      backgroundColor:'#fff',
      width: 190,
      minHeight:50,
      maxHeight: Platform.OS ==='ios' ? 350 : 380,
      top: Platform.OS==='ios' ? 10 : 25,
      paddingTop:20,
      paddingBottom:Platform.OS ==='ios' ? 10 : 20,
      borderColor:'#E1E7EC',
      zIndex:4,

  },
  overLayoutLoc:{
      backgroundColor:'#fff',
      width: 190,
      minHeight:50,
      maxHeight: Platform.OS ==='ios' ? 330 : 360,
      top: 7,
      //paddingTop:20,
      borderColor:'#E1E7EC',
      zIndex:4,
  },
  overLayoutSer:{
      alignSelf:'flex-end',right:10
  },
  colorTitle:{color:'#2F353F',fontSize:16},
  marRight:{marginRight:5},
  titlePer:{color:'#fff',fontSize:17},
  borderItemPer:{borderBottomColor:'#616A78',borderBottomWidth:1,paddingTop:15,width:width-75},
  borderItemInfoPer:{borderBottomColor:'#616A78',borderBottomWidth:1,marginLeft:40,},
  padPerInfo:{paddingTop:15,paddingBottom:15,width:width-75},
  imgIconPerInfo:{width:24,height:24,marginRight:15},
  imgIconPer:{width:24,height:24,marginRight:15,marginTop:15},
  titleTab:{color:'#9B9A9B',fontSize:18},
  titleTabActive:{color:'#000',fontSize:18},
  titleActive:{color:'#fff',fontSize:18},
  titleErr:{color:'#D0021B',fontSize:18},
  colorErr:{color:'#D0021B'},
  wrapListImage:{
    flexDirection: 'row',
      flexWrap: 'wrap',
      flex:1,
    },
  imgTab:{width:width/3,height:width/3,maxHeight:300,maxWidth:300},
  colorWhite:{color:'#fff'},
  colorTextPP :{color:'#B8BBC0'},
  colorTxt :{color:'#5B8EDC',fontSize:16},
  colorText :{color:'#303B50',fontSize:17},
  widthDay:{width:45},widthYear:{width:60},
  wrapInfo:{position:'absolute',zIndex:999,width,height,top:0,left:0,backgroundColor:'transparent'},
  wrapBtnInfo:{height:150,backgroundColor:'#fff',borderWidth:1,borderColor:'#E1E7ED',alignItems:'center' },
  posDay:{top:320,left:57},
  posMonth:{top:320,left:115},
  posYear:{top:320,left:175},
  listCreate:{padding:15,flexDirection:'row',backgroundColor:'#fff',marginBottom:1,alignItems:'center',justifyContent:'space-between',position:'relative'},
  itemKV:{width:(width-50)/3,backgroundColor:'#2E3B51',borderRadius:3,padding:10},
  txtKV:{color:'#fff',alignSelf:'center'},
  widthLblCre:{width: Platform.OS==='ios' ? 20 : 30,alignItems:'center'},
  wrapInputCreImg:{width:width-75,padding:0,fontSize:16,paddingLeft: Platform.OS==='ios' ? 10 : 15,paddingRight:15},
  wrapCreImg:{width:width-85},
  imgCamera:{width:30,height:30,borderRadius:15,backgroundColor:'#F1F1F5',alignItems:'center',justifyContent:'center'},
  colorlbl :{color:'#323640',fontSize:16},
  colorNumPP :{fontWeight: 'bold',color:'#2F353F'},
  // imgUp:{width: 14,height: 7,top:166,position:'absolute'},
  imgUpCreate:{width: 14,height: 7,top:166,position:'absolute'},
  imgUpBuySell:{width: 14,height: 7,top:120,position:'absolute'},
  imgUpInfo :{right:58},
  imgUpLoc :{left:58},
  listAdd:{padding:15,flexDirection:'row',justifyContent:'space-between',backgroundColor:'white',marginBottom:1},
  imgUpSubCat :{alignSelf:'center'},
  imgUpShare :{right:20},
  imgMargin: {margin:5},
  listCatOver:{paddingRight:20,paddingBottom:20,paddingLeft:20,},
  listCatAll:{padding:10,paddingRight:15,paddingLeft:15},
  listCatBG:{backgroundColor:'#F0EEF0'},
  headPerBG:{backgroundColor:'#2B3546',padding:15},
  infoPerBG:{backgroundColor:'#394456',padding:15},
  listCatW:{backgroundColor:'#FFF'},
  listOver:{alignItems:'center',flexDirection:'row',padding:10,borderBottomColor:'#EEEDEE', borderBottomWidth:1,},
  listOverShare:{alignItems:'center',flexDirection:'row',paddingLeft:5},
  listOverService:{
      borderBottomColor:'#EEEDEE',
      borderBottomWidth:1,
  },
  serviceList:{flexDirection:'row',justifyContent:'center',alignItems:'center',borderBottomColor:'#C8C7C8',borderBottomWidth:1},
  serviceOver:{position:'absolute',zIndex:9,top: 65},
  catInfoOver:{padding:15,bottom:0,zIndex:6,backgroundColor:'#fff',width,flexDirection:'row'},
  wrapInfoOver:{flex:1,flexWrap: 'wrap',justifyContent:'space-between'},
  txtTitleOver:{color:'#2F353F',fontSize:20,marginBottom:10,maxHeight:50,overflow:'hidden'},
  txtAddrOver:{color:'#6587A8',fontSize:14,overflow:'hidden',},
  txt:{color:'#6587A8',fontSize:16},
  titleHead:{color:'#fff',fontSize:24,fontWeight:'500'},
  show : { display: 'flex'},
  hide : { display: 'none'},
  hidden:{ position:'absolute',right:-width}
}
