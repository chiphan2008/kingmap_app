import {Dimensions,Platform} from 'react-native';
const {height, width} = Dimensions.get('window');

const w = width>height ? width : height;
const h = width>height ? height : width;

module.exports = {
  container: {flex: 1,backgroundColor:'#F1F2F5'},
  bgImg : {
    width,height,position: 'absolute',justifyContent: 'center',alignItems: 'center',alignSelf: 'stretch',resizeMode: 'stretch',
  },
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

  wrapFilter:{alignItems:'center',marginTop:15,marginBottom:15,},
  filterFrame:{width:width-40,justifyContent:'space-between',alignItems:'center',flexDirection:'row'},
  inputSearch : {
    marginTop: 3,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
  selectBoxLoc:{
    backgroundColor:'#fff',
    width:Platform.OS ==='ios' ? 100 : 110,
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
  wrapListLoc:{
    backgroundColor:'#fff',
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#ddd',
    shadowOpacity: .5,
    minHeight: height-50,
    padding:20,
  },
  titleSubCat:{
    fontSize:20,
    padding:20
  },
  wrapFlatList:{
    paddingLeft:20,
    paddingBottom:150,
  },
  txtTitleOverCat:{color:'#2F353F',fontSize:18,marginBottom:7,maxHeight:50,overflow:'hidden'},
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
    paddingBottom: Platform.OS==='ios' ? 80 : 40,
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
    flexDirection:'row',
  },
  imgFlatItem:{
    marginRight:10,
    width:90,height:90,
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
    height:350,
    alignItems:'center',
    justifyContent:'center',
  },
  wrapCircle:{
    position:'absolute',
    flex:1,
    alignItems:'center',

  },
  circle1:{top:-5,left :120,},
  circle2:{top:44,left:222,},
  circle3:{top:154,left :247,},
  circle4:{top:242,left :176,},
  circle5:{top:242,left :64,},
  circle6:{top:154,left :-7,},
  circle7:{top:44,left :22,},
  // circle1:{top:0,left :120,},
  // circle2:{top:60,left :224,},
  // circle3:{top:180,left :224,},
  // circle4:{top:240,left :120,},
  // circle5:{top:180,left :16,},
  // circle6:{top:60,left :16,},
  logoCenter:{top:120},

  wrapContent :{
    //flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    flex:1,
  },
  labelCat :{
    backgroundColor:'transparent',textAlign:'center',position:'relative'
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
    top:Platform.OS ==='ios' ? 48 : 35,right:10,
  },

  OptionItem : {
    paddingTop: 7,paddingBottom: 0,marginTop: 0,marginBottom: 0,
  },
  plusStyle :{bottom:70,position:'absolute',right:10,
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
  paddingLoc:{ paddingTop: 130},
  padCreate:{ paddingTop: 165},
  popoverLoc : {
    alignItems:'center',
    position:'absolute',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:5,
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
  itemCreate:{marginBottom:10,backgroundColor:'#fff',width: 150,padding:15,borderRadius:5},
  overLayout:{
    backgroundColor:'#fff',width: width-20,borderRadius:6,overflow:'hidden',top:7,
    maxHeight:Platform.OS ==='ios' ? 350 : 380,
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
      maxHeight: Platform.OS ==='ios' ? 350 : 380,
      top: 7,
      paddingTop:20,
      borderColor:'#E1E7EC',
      zIndex:4,
  },
  overLayoutSer:{
      alignSelf:'flex-end',right:10
  },
  marRight:{marginRight:5},
  titleTab:{color:'#9B9A9B',fontSize:18},
  titleTabActive:{color:'#000',fontSize:18},
  wrapListImage:{
    flexDirection: 'row',
      flexWrap: 'wrap',
      flex:1,
    },
  imgTab:{width:width/3,height:width/3,maxHeight:300,maxWidth:300},
  colorWhite:{color:'#fff'},
  colorTextPP :{color:'#B8BBC0'},
  colorText :{color:'#303B50',fontSize:17},
  listCreate:{padding:15,flexDirection:'row',backgroundColor:'#fff',marginBottom:1,alignItems:'center',justifyContent:'space-between'},
  itemKV:{width:(width-50)/3,backgroundColor:'#2E3B51',borderRadius:3,padding:5},
  txtKV:{color:'#fff',alignSelf:'center'},
  widthLblCre:{width:30},
  wrapInputCreImg:{width:width-75,padding:0},
  wrapCreImg:{width:width-85},
  imgCamera:{width:30,height:30,borderRadius:15,backgroundColor:'#F1F1F5',alignItems:'center',justifyContent:'center'},
  colorlbl :{color:'#323640',fontSize:16},
  colorNumPP :{fontWeight: 'bold',color:'#2F353F'},
  imgUp:{width: 14,height: 7,top:131,position:'absolute'},
  imgUpCreate:{width: 14,height: 7,top:166,position:'absolute'},
  imgUpInfo :{right:58},
  imgUpLoc :{left:58},
  listAdd:{padding:15,flexDirection:'row',justifyContent:'space-between',backgroundColor:'white',marginBottom:1},
  imgUpSubCat :{alignSelf:'center'},
  imgUpShare :{right:20},
  imgMargin: {margin:10},
  listCatOver:{paddingRight:20,paddingBottom:20,paddingLeft:20,},
  listCatAll:{padding:10,paddingRight:15,paddingLeft:15},
  listCatBG:{backgroundColor:'#F0EEF0'},
  listCatW:{backgroundColor:'#FFF'},
  listOver:{alignItems:'center',flexDirection:'row',padding:10,borderBottomColor:'#EEEDEE', borderBottomWidth:1,},
  listOverShare:{alignItems:'center',flexDirection:'row',paddingLeft:5},
  listOverService:{
      padding:15,
      borderBottomColor:'#EEEDEE',
      borderBottomWidth:1,
  },
  serviceList:{flexDirection:'row',justifyContent:'center',alignItems:'center',borderBottomColor:'#C8C7C8',borderBottomWidth:1},
  serviceOver:{position:'absolute',zIndex:9,top: 65},
  catInfoOver:{padding:15,bottom:0,zIndex:6,backgroundColor:'#fff',width,flexDirection:'row'},
  wrapInfoOver:{flex:1,flexWrap: 'wrap'},
  txtTitleOver:{color:'#2F353F',fontSize:20,marginBottom:10,maxHeight:50,overflow:'hidden'},
  txtAddrOver:{color:'#6587A8',fontSize:14,overflow:'hidden',},
  show : { display: 'flex'},
  hide : { display: 'none'},

}
