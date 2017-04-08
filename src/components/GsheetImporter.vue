<template>

<div class="spreadsheets">

    <md-layout md-gutter>
    <md-layout md-flex="30">
    <md-whiteframe  md-elevation="2">
    <form class="form-import" novalidate @submit.stop.prevent="submit">

          <md-input-container>
            <label>Spreadsheets ID</label>
            <md-input v-model="spreadsheets.id" placeholder="Enter your spreadsheets id"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Spreadsheets Name</label>
            <md-input v-model="spreadsheets.name" placeholder="Enter your spreadsheets name"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Spreadsheets Range</label>
            <md-input v-model="spreadsheets.range" placeholder="Enter your spreadsheets range"></md-input>
          </md-input-container>

          <md-input-container>
              <label>Presenter</label>
              <md-select name="select-presenter" v-model="presenterID">
                  <md-option v-for="p in presenters" :key="p.id" :value="p.id">{{ p.name }}</md-option>
              </md-select>
         </md-input-container>

         <md-input-container>
             <label>Class</label>
             <md-select name="select-class" v-model="commClassID">
                 <md-option v-for="c in commClasses" :key="c.id" :value="c.id">{{ c.name }}</md-option>
             </md-select>
        </md-input-container>

        <md-input-container>
            <label>Session</label>
            <md-select name="select-session" v-model="classSessionID">
                <md-option v-for="classSession in classSessions" :key="classSession.id" :value="classSession.id">{{ classSession.name }}</md-option>
            </md-select>
       </md-input-container>

          <md-button @click.native="getSpreadsheets" class="md-raised md-primary">Import</md-button>

     </form>
 </md-whiteframe>
</md-layout>
<md-layout md-flex="40">

     <md-whiteframe md-elevation="2">
     <md-table class="table-mapping" v-show="spreadsheets.headers.length > 0">
         <md-table-header>
             <md-table-row>
                 <md-table-head>Field</md-table-head>
                 <md-table-head>Map to</md-table-head>
             </md-table-row>
         </md-table-header>

         <md-table-body>
             <md-table-row v-for="(header, index) in spreadsheets.headers">
                 <md-table-cell>
                     {{ header }}
                 </md-table-cell>
                 <md-table-cell>
                     <md-input-container>
                         <md-select name="selected[index]" v-model="selected[index]" >
                             <md-option v-for="feedbackField in feedbackFields" :key="feedbackField.id" :value="feedbackField.id">{{ feedbackField.name }}</md-option>
                         </md-select>
                    </md-input-container>
                </md-table-cell>
             </md-table-row>
         </md-table-body>
     </md-table>

 </md-whiteframe>
</md-layout>


 <md-layout md-column md-flex="15">

         <md-button v-show="spreadsheets.headers.length > 0" @click.native="onSubmit" class="md-raised md-primary">Export</md-button>


 </md-layout>

</md-layout>

</div>

</template>

<script>
export default {
    name: 'spreadsheets',
    created: function() {
        this.checkAuth()
        this.fetchClasses()
        this.fetchPresenters()
        this.fetchSessions()
        this.fetchFieldMaps()
    },
    data () {
        return {
            selected:[],
            classSessions:[],
            classSessionID: 1,
            commClassID: `jpcccol-b1-2016`,
            commClasses: [],
            presenterID: 1,
            presenters: [],
            feedbackFields:[],
            spreadsheets: {
                id: '1pNHG0uPsMyaLjinREP4UYXXeVrUw0-3UCHZ7uxltIEQ',
                name: 'Form Responses 1',
                range : 'A1:L',
                headers: [],
                values: []
            },
            authResponse: {},
            user: {
                access_token: '',
                authenticated: false
            },
            googleSignInParams: {
                fetch_basic_profile: true,
                client_id: '109627679072-u29e9t4lbqg9ruprltl9d28hgqsg6fc6.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
            }
        }
    },
    methods: {
        checkAuth: function() {
            var token = localStorage.getItem('access_token');
            if (token) {
                this.user.access_token = token
                this.user.authenticated = true;
            }  else {
                this.user.authenticated = false;
            }
        },
        fetchClasses: function() {
            var url = 'http://localhost:7777/class'
            this.$http.get(url, {headers: {'Access-Control-Allow-Origin':'http://localhost:8080'}}).then(response => {
                this.commClasses = response.data
            }, response => {
                alert('Whoops! Cannot get classes from ezra server. Please try again later.')
                console.log(response.text())
            });
        },
        fetchFieldMaps: function() {
            var url = 'http://localhost:7777/feedback/field'
            this.$http.get(url, {headers: {'Access-Control-Allow-Origin':'http://localhost:8080'}}).then(response => {
                this.feedbackFields = response.data
            }, response => {
                alert('Whoops! Cannot get fields from ezra server. Please try again later.')
                console.log(response.text())
            });
        },
        fetchPresenters: function() {
            var url = 'http://localhost:7777/presenter'
            this.$http.get(url, {headers: {'Access-Control-Allow-Origin':'http://localhost:8080'}}).then(response => {
                this.presenters = response.data
            }, response => {
                alert('Whoops! Cannot get presenters from ezra server. Please try again later.')
                console.log(response.text())
            });
        },
        fetchSessions: function() {
            var url = 'http://localhost:7777/session'
            this.$http.get(url, {headers: {'Access-Control-Allow-Origin':'http://localhost:8080'}}).then(response => {
                this.classSessions = response.data
            }, response => {
                alert('Whoops! Cannot get sessions from ezra server. Please try again later.')
                console.log(response.text())
            });
        },
        getAccessToken: function() {
            console.log(localStorage.getItem("access_token"))
            return {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        },
        getSpreadsheets: function() {
            var values = this.spreadsheets.name + '!'+ this.spreadsheets.range
            var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + this.spreadsheets.id + '/values/' + values
            this.$http.get(url, {headers: this.getAccessToken()}).then(response => {
                this.spreadsheets.headers = response.data.values[0]
                for (var i = 1; i < response.data.values.length; i++) {
                    this.spreadsheets.values.push(response.data.values[i])
                }
            }, response => {
                alert('Whoops! Cannot connect to google spreadsheets. Please try again later.')
                console.log(response.text())
            });
        },
        onSubmit: function(e) {
           e.preventDefault()

           var mapping = []

           for (var i = 0; i < this.spreadsheets.headers.length; i++) {
               mapping.push({
                   "header_id":i,
                   "field_id": this.selected[i]
               })
           }

           var data = {
               "presenter_id": this.presenterID,
               "class_id": this.commClassID,
               "session_id": this.classSessionID,
               "mappings": mapping,
               "values": this.spreadsheets.values
           }

           var url = 'http://localhost:7777/exportfeedback'
           this.$http.post(url, data).then(response => {
               alert('Export completed!')
           }, response => {
               alert('Whoops! Cannot connect to ezra. Please try again later.')
           });


           console.log(data)

       }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
}

.form-import {
    width: 350px;
    margin: 16px;
    padding: 16px;
}

.table-mapping {
    width: 500px;
}

</style>
