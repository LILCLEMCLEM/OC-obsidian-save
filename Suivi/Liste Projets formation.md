```dataview
table desc as "description" ,date_debut.day as "date début", date_fin.day as "date fin"
FROM -"Template"
where contains(tags, "projects")
sort file.name 
```
