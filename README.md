<table border="0">
 <tr>
    <td><img src="doc/img/{mysql}.png" alt="object_mysql" style="width:200px;"/></td>
    <td> 
    <h1>Module: object_mysql</h1>
    <h2>Retrieve databases in Javascript object format</h2>
    <p>With this module synchronize the Mysql database in a more dynamic<br> way to implement in your project created with NodeJs</p>
    </td>
 </tr>
</table>
<br>

## Installation

```sh
npm i object_mysql
```

## Usage
### Initial setup
The way to use this module is by declaring the following attributes in the environment variables.
| Variable  | Definition |
|---        |--- |
| DB_HOST   | IPv4 addresses and host names |
| DB_USER   | User name |
| DB_PASS   | Database password |
| DB_TABLE  | Schema name |
<br>

### Module Additions Method
|Name | Method  | Definition |  Return data |
|--- |--- |--- |--- |
| db | db.query (sql:string,params:object) |  Make an inquiry directly | { error, result }|

You can pass parameters to the query so that the data to the query is parsed
<br>

## Example: direct query
```ts
import Dotenv from 'dotenv'
import ObjectDB from 'object_mysql'

Dotenv.config()

const exec = async () => {

    // Retrieve object from database
    const { NameToTable, db } = await ObjectDB() 

    // ==========================================
    // "db" is an instance of "new Database()"
    // ==========================================

    // Directly run a query
    const sql = 'SELECT * FROM nametotable WHERE id = :attribute_name'
    const { error, result } = await db.query(sql, {attribute_name:1})
}

exec()
```
<br>

### Method of using the objects

|Method | Parameters  | Definition |  Return data |
|--- |--- |--- |--- |
| add | params:object                        | Add data to the table | { error, result }|
| get | params:object                         | Recover data |{ error, result }|
| update | id:number-string, params:object      | Update data |{ error, result }|
| remove | id:number-string                    | Delete data |{ error, result }|
| getByPk | id:number-string, pk: any = 'id'   | Recover data based on its primary key |{ error, result }|
| getByAttr | nameAttr:string, attr: string-number-null  | Retrieve data according to its attributes |{ error, result }|
| count | row:string, params:object             | Retrieve register total | int |
| getTotal | ---                                  | Retrieve register total | int |
| isExist | params:object                     | Check if record exists based on attributes | boolean |
<br>

## Example: directly attack the table object
```ts
import Dotenv from 'dotenv'
import ObjectDB from 'object_mysql'

Dotenv.config()

const exec = async () => {

    // Retrieve object from database
    const { db } = await ObjectDB() 

    // Add data to the table
    const { error, result } = await NameToTable.add({name:"Testing data"})

    if(error) return false 

    //Unique identifier of the inserted data
    const { insertId:id } = result

    // Update data
    const { error, result } = await NameToTable.update(id,{name:"Testing data 2"})

    if(error) return false

    // Recover data
    const { error, result } = await NameToTable.get({id})

    if(error) return false

    // Delete data
    const { error, result } = await NameToTable.remove(id)
}

exec()
```
<br>

## Last test

Tests have been carried out to check the operation of the connections, create, read, update, remote and also additional functions

![alt text](doc/img/test.PNG)