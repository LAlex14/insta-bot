// photo_link: link to the photo you want to comment on
// file_name: name of the file that contains the users
// comm_total: total number of comments to be posted
// comm_per_run: number of comments to be posted in one run
// comm_delay_sec: delay between comments in one run (in seconds)
// run_pause_min: pause between runs (in minutes)
// tags_nr: number of tags to be used in one comment
// acc_pause_min: pause between accounts (in minutes)
// users: array of objects containing the usernames and passwords of the accounts

module.exports = {
  login_url: "https://www.instagram.com/accounts/login",
  photo_link: "https://www.instagram.com/reel/xxxxxxx",
  file_name: "./src/utils/users.json",
  users: [
    {
      username: "username",
      password: "password",
    },
    {
      username: "username",
      password: "password",
    },
  ],
  comm_total: 50,
  comm_per_run: 25,
  comm_delay_sec: 30,
  run_pause_min: 10,
  acc_pause_min: 60,
  tags_nr: 1
}
