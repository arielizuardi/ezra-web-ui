<template>

<div class="spreadsheets">
    <!--Add buttons to initiate auth sequence and sign out-->
    <div class="mdl-grid">
        <g-signin-button
        :params="googleSignInParams"
        @success="onSignInSuccess"
        @error="onSignInError"
        v-show="!user.authenticated">
        Sign in with Google
        </g-signin-button>

        <div class="mdl-cell mdl-cell--12-col">

            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" id="sid" size="200" maxlength="200" v-model="spreadsheetsID">
                <label class="mdl-textfield__label" for="sid">Spreadheet ID</label>
            </div>

            <br />
            <button v-on:click="getSpreadsheets" v-show="user.authenticated" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                Get spreadsheets
            </button>

            <button  v-on:click="logout" v-show="user.authenticated" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                Logout
            </button>

        </div>

        <div class="mdl-cell mdl-cell--12-col">
            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Field</th>
                        <th class="mdl-data-table__cell--non-numeric">Map to</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="h in spreadsheetsHeaders">
                    <td>{{ h }}</td>
                    <td>
                        <select>
                            <option v-for="opt in mapOptions" :value="opt.id">{{ opt.value }}</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
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
            mapOptions : [
                {"id":1, "value":"Penguasaan Materi"},
                {"id":2, "value":"Sistematika Penyajian"},
                {"id":3, "value":"Gaya atau metode penyajian"},
                {"id":4, "value":"Pengaturan Waktu"},
                {"id":5, "value":"Pengguaan Alat Bantu"},
            ],
            spreadsheetsID: '',
            spreadsheetsResp: '',
            spreadsheetsHeaders : [],
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
            var sheet = 'Form Responses 1'
            var range = sheet+'!'+ 'A1:L'
            var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + this.spreadsheetsID + '/values/' + range
            this.$http.get(url, {headers: this.getAccessToken()}).then(response => {
                var data = response.data
                this.spreadsheetsHeaders = data.values[0]
            }, response => {
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
