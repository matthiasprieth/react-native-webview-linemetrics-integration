import React from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';

export default class App extends React.Component {
  render() {

    let html = `
        <script> var loaded = 0; </script>
        <script src="http://code.jquery.com/jquery-3.2.1.min.js" onload="loaded=1"></script>
        <script src="https://www.store.me/share/linemetrics_sdk.min.js" onload="loaded=2"></script>
        <div id="mod_selfstorage_smart_sensors">
            WebView
            <div id="linemetrics">
            </div>
        </div>
    `

    let jsCode = `
        try{
          var selfstorageSensors = {
            self : this,

            form: null,

            init: function()
            {
              selfstorageSensors.container = $('#mod_selfstorage_smart_sensors');

              alert(linemetrics);
              if(linemetrics){
                selfstorageSensors.initLinemetrics();
              }
            },

            initLinemetrics: function(){

              var CLIENT_SECRET = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
              var CLIENT_ID = "api_xxxxxxxxxxx";

              var api = new LM_API("client_credentials",CLIENT_ID,CLIENT_SECRET);

              api.authenticate().then(function(auth){
                alert(JSON.stringify(auth));
                alert('going to load object now');
                api.loadObject( "FRY/temperature" ).then(function(entry){
                  alert(entry);
                }, function(error){
                  alert("innerError");
                  alert(error);
                });
              }).catch(function(error){
                console.log("outerError");
                console.log(error);
              });
            },

            objectCallback: function(entry, code){
              entry = entry[0];
              var el = $("<div/>");
              var time = new Date().getTime();

              el.css("height","200px");

              $("#linemetrics ."+code).after(el);
              entry.createChart(el);
              
              entry.loadData(time-(86400000*4),time,"PT1H").then(function(data){

              });
              
              el.on("data",function(event,data){
                selfstorageSensors.linemetricsLoaded();
              });
              
              setTimeout(function(){
                entry.updateChart(time-(86400000*4),time,"PT1H");
              }, 5000);
            }

          };

          $(function(){
            alert('beforeInit');
            selfstorageSensors.init();
            alert('afterInit');
          });
      
        }catch(err){
          alert('generalError');
          alert(err);
        }

    `

    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>

        <Text style={{marginTop: 10}}>Hier im unteren Bereich befindet sich die Linemetrics-Webview</Text>
        <WebView
            ref="myWebView"
            mixedContentMode="always"
            source={{html: html}}
            injectedJavaScript={jsCode}
            javaScriptEnabledAndroid={true}
            style={{height: 100, marginTop: 10, alignItems: 'center'}}
        >
        </WebView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
