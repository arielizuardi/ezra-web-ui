<template>

<div class="spreadsheets">
    <!--Add buttons to initiate auth sequence and sign out-->
    <g-signin-button
    :params="googleSignInParams"
    @success="onSignInSuccess"
    @error="onSignInError"
    v-show="!user.authenticated">
    Sign in with Google
    </g-signin-button>

    <div class="mdl-grid" v-show="user.authenticated">
        <div class="mdl-cell mdl-cell--4-col">

            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" id="sid" size="200" maxlength="200" v-model="spreadsheets.id">
                <label class="mdl-textfield__label" for="sid">Spreadheet ID</label>
            </div>
            <br />
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" id="sname" size="200" maxlength="200" v-model="spreadsheets.name">
                <label class="mdl-textfield__label" for="sname">Spreadsheets Name</label>
            </div>
            <br />
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" id="srange" size="200" maxlength="200" v-model="spreadsheets.range">
                <label class="mdl-textfield__label" for="srange">Range</label>
            </div>



            <br />
            <button v-on:click="getSpreadsheets" v-show="user.authenticated" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                Get spreadsheets
            </button>

            <button v-on:click="logout" v-show="user.authenticated" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                Logout
            </button>

        </div>

        <div class="mdl-cell mdl-cell--8-col">
            <form v-on:submit="onSubmit">
            <table v-show="spreadsheets.headers.length > 0" class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Field</th>
                        <th class="mdl-data-table__cell--non-numeric">Map to</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(header, index) in spreadsheets.headers">
                    <td>{{ header }}</td>
                    <td>
                        <select :name="selected[index]" v-model="selected[index]" >
                            <option v-for="opt in mapOptions" :value="opt.id">{{ opt.value }}</option>
                        </select>
                    </td>
                </tr>

                <tr>
                    <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        Submit!
                    </button>
                </tr>

                </tbody>
            </table>
            </form>
        </div>
    </div>
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
            presenters: [
                {"id":1,"name":"Juferson Mangempis"},
                {"id":2, "name":"Hendry Tjiu"},
                {"id":3, "name":"Yvone Astri"}
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
        logout: function() {
            localStorage.removeItem('access_token')
            this.user.authenticated = false
            this.user.access_token = ''
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
        onSignInSuccess: function(googleUser) {
            // `googleUser` is the GoogleUser object that represents the just-signed-in user.
            // See https://developers.google.com/identity/sign-in/web/reference#users
            this.authResponse = googleUser.getAuthResponse(true); // etc etc
            localStorage.setItem("access_token", this.authResponse.access_token)

            this.user.authenticated = true
            this.user.access_token = this.authResponse.access_token
        },
        onSignInError: function(error) {
          // `error` contains any error occurred.
          console.log('Cannot sign-in', error)
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
               "mapping": mapping,
               "values": this.spreadsheets.values
           }

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
</style>
