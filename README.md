<table border="0">
 <tr>
    <td><img src="doc/img/{mysql}.png" alt="object_mysql" style="width:200px;"/></td>
    <td> 
    <h1>Module: object_mysql</h1>
    <h2>Retrieve databases in Javascript object format</h2>
    <p>With this module synchronize the Mysql database in a more dynamic<br> way to implement in your project created with NodeJs</p>
    <button name="button" style="background:#2196f3; color:white; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;" onclick="https://www.npmjs.com/package/object_mysql">Ir a npm</button>
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

## Example
```ts
import Dotenv from 'dotenv'
import ObjectDB from 'object_mysql'

Dotenv.config()

const exec = async () => {

    // Retrieve object from database
    const { NameToTable } = await ObjectDB() 

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

## Last test

Tests have been carried out to check the operation of the connections, create, read, update, remote and also additional functions

![alt text](doc/img/test.PNG)