<template>
  <div id="app">
      <div class="phone-viewport">
          <md-toolbar>
              <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
                  <md-icon>menu</md-icon>
              </md-button>

              <h2 class="md-title">My App</h2>
          </md-toolbar>


          <md-sidenav class="md-left" ref="leftSidenav">
              <md-card>

                  <md-card-header>

                      <md-card-media>
                          <md-avatar class="md-large">
                              <img src="https://randomuser.me/api/portraits/women/21.jpg" alt="People">
                          </md-avatar>

                      </md-card-media>

                      <md-card-header-text>
                          <div class="md-subhead">Welcome, </div>
                          <div class="md-title">Christine</div>
                      </md-card-header-text>

                  </md-card-header>
                  <md-card-actions>
                      <g-signin-button
                      :params="googleSignInParams"
                      @success="onSignInSuccess"
                      @error="onSignInError"
                      v-show="!user.authenticated">
                      Sign in with Google
                      </g-signin-button>

                      <md-button class="md-primary" @click.native="logout" v-show="user.authenticated">Logout</md-button>
                  </md-card-actions>

              </md-card>
              <md-list class="md-dense">
                  <md-list-item>
                      <md-icon>move_to_inbox</md-icon> <span>Inbox</span>
                  </md-list-item>
                  <md-list-item>
                      <md-icon>send</md-icon> <span>Sent Mail</span>
                  </md-list-item>

              </md-list>
          </md-sidenav>


          <div class="page-content">
              <router-view></router-view>
          </div>


      </div>


  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
      return {
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
      what: function() {
          console.log('its clicked')
          alert('clicked')
      },
      logout() {
          localStorage.removeItem('access_token')
          this.user.authenticated = false
          this.user.access_token = ''
      },
      toggleLeftSidenav() {
          this.$refs.leftSidenav.toggle();
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
  }
}
</script>

<style>
#app {
  /**font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;**/
}

.avatar {
    margin:auto;
    width: 80px;
    height: 80px;
    border-radius: 38px;
}

.avatar-container {
    background-color: #63cb42;
    color: #ffffff;
    padding: 70px 20px 30px 20px;
}

.avatar-name {
    margin: 0px;
    padding: 0px;
}

.avatar-welcome {

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

.page-content {
    padding: 20px;
}
</style>
