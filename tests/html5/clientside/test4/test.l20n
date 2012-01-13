<plural(n) {n==0?"none":n==1?"one":"many"}>


<name "Name">

<name_input
 value: "{{user.name}}"
 placeholder: "Write your name {{user.name}}"
 title: "You can give us your nickname if you prefer">

<window_title "Downloading {{downloadCount}} files">

<download_status[plural(downloadCount)] {
  none: "{{user.name}} is currently downloading no files.",
  one: "{{user.name}} is currently downloading one file.",
  many: "{{user.name}} is currently downloading {{downloadCount}} files."
}>

<mood[user.gender] {
  male: "He's happy!",
  female: "She's happy!"
}>
