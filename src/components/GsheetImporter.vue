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
              <md-select name="select-presenter" v-model="presenter">
                  <md-option v-for="p in presenters" :key="p.id" :value="p">{{ p.name }}</md-option>
              </md-select>
         </md-input-container>

         <md-input-container>
             <label>Class</label>
             <md-select name="select-class" v-model="commClass">
                 <md-option v-for="c in commClasses" :key="c.id" :value="c">{{ c.name }}</md-option>
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
                             <md-option v-for="opt in mapOptions" :key="opt.id" :value="opt.id">{{ opt.value }}</md-option>
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
    },
    data () {
        return {
            selected:[],
            commClass: {},
            commClasses: [
                {"id":"jpcc-col-b1-2016", "name": "COL Batch 1 2016", "batch":1, "year":2016},
                {"id":"jpcc-col-b2-2016", "name": "COL Batch 2 2016", "batch":2, "year":2016},
                {"id":"jpcc-col-b3-2016", "name": "COL Batch 3 2016", "batch":3, "year":2016},
                {"id":"jpcc-col-b1-2017", "name": "COL Batch 1 2017", "batch":1, "year":2017}
            ],
            presenter:{},
            presenters: [
                {"id":1,"name":"Yan Hendry Jawena"},
                {"id":2,"name":"Juferson Mangempis"},
                {"id":3, "name":"Hendry Tjiu"},
                {"id":4, "name":"Yvone Astri"}
            ],
            mapOptions : [
                {"id":1, "value":"Timestamp"},
                {"id":2, "value":"Nama Partisipan"},
                {"id":3, "value":"D.A.T.E"},
                {"id":4, "value":"Group COL"},
                {"id":5, "value":"Penguasaan Materi"},
                {"id":6, "value":"Sistematika Penyajian"},
                {"id":7, "value":"Gaya atau metode penyajian"},
                {"id":8, "value":"Pengaturan Waktu"},
                {"id":9, "value":"Penggunaan Alat Bantu"},
                {"id":10, "value":"Nilai keseluruhan"},
                {"id":11, "value":"Hal-hal yang saya suka"},
                {"id":12, "value":"Hal-hal yang saya harapkan"}
            ],
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
                   "field_id":i,
                   "field_name": this.spreadsheets.headers[i],
                   "map_id": this.selected[i]
               })
           }

           var data = {
               "presenter": this.presenter,
               "class": this.commClass,
               "mapping": mapping,
               "values": this.spreadsheets.values
           }

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
