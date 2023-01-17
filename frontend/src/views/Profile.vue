<template>

    <nav>
      <div class="logo">
        <img src="./logos.svg" alt="logo">
      </div>
      <button @click="handleLogout" class="logout-button">Log Out</button>
    </nav>


    <div class="h-full bg-orange-200 flex mt-12">

        <!-- Update Profile -->
       
        <div class="h-full w-1/3 p-8 mt-24"> 
            <h1 class="text-center font-bold text-xl mb-3">Edit Profile</h1>
            <input type="text" v-model="user_credentials.username" placeholder="Name" class="mb-4">
            <input type="text" placeholder="New Password" class="mb-4">
            <input type="text" v-model="user_credentials.password" placeholder="New Password"  class="mb-4">

            <button @click='updateProfile("username")' class="bg-orange-600 hover:bg-orange-700 p-3 rounded-full text-white cursor-pointer w-full">Update Username</button>
            <button @click='updateProfile("password")' class="bg-blue-600 hover:bg-blue-700 p-3 rounded-full text-white cursor-pointer w-full mt-2">Update Password</button>
        
        </div>

        <div class="h-full w-2/3 p-8 ">
           <div class="flex h-[80px] justify-around gap-2 ">
                <div class="bg-white rounded-xl h-full grow">
                    <div class="font-bold text-lg text-center"> 
                        Total Score
                    </div>
                    <div class="text-center text-gray-600 text-lg border-t-2 pt-2">420</div>
                </div>
                <div class="bg-white rounded-xl h-full grow">
                    <div class="font-bold text-lg text-center"> 
                        Monthly Score
                    </div>
                    <div class="text-center text-gray-600 text-lg border-t-2 pt-2">420</div>
                </div>
                <div class="bg-white rounded-xl h-full grow">
                    <div class="font-bold text-lg text-center"> 
                        Total Coins
                    </div>
                    <div class="text-center text-gray-600 text-lg border-t-2 pt-2">420</div>
                </div>
           </div>


             <!--Offer Table History  -->
            <div class="mt-8 bg-white rounded-xl pt-2">
                <h1 class="text-center font-bold text-xl mb-3">My Offers History</h1>
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            <th class="px-4 py-2">Offer</th>
                            <th class="px-4 py-2">Product</th>
                            <th class="px-4 py-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class=" px-4 py-2">1</td>
                            <td class=" px-4 py-2">2</td>
                            <td class=" px-4 py-2">3</td>
                        </tr>
                        <tr class="">
                            <td class=" px-4 py-2">1</td>
                            <td class=" px-4 py-2">2</td>
                            <td class=" px-4 py-2">3</td>
                        </tr>
                        <tr>
                            <td class=" px-4 py-2">1</td>
                            <td class=" px-4 py-2">2</td>
                            <td class=" px-4 py-2">3</td>
                        </tr>
                    </tbody>
                </table>
            </div>



             <!-- Votes  Table History  -->
            <div class="mt-8 bg-white rounded-xl pt-2">
                <h1 class="text-center font-bold text-xl mb-3">My Votes History</h1>
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            <th class="px-4 py-2">Vote</th>
                            <th class="px-4 py-2">Direction</th>
                            <th class="px-4 py-2">Product</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class=" px-4 py-2">1</td>
                            <td class=" px-4 py-2">2</td>
                            <td class=" px-4 py-2">3</td>
                        </tr>
                        <tr class="">
                            <td class=" px-4 py-2">1</td>
                            <td class=" px-4 py-2">2</td>
                            <td class=" px-4 py-2">3</td>
                        </tr>
                        <tr>
                            <td class=" px-4 py-2">1</td>
                            <td class=" px-4 py-2">2</td>
                            <td class=" px-4 py-2">3</td>
                        </tr>
                    </tbody>
                </table>
                </div>


    

        
        </div>






    </div>
    


</template>


<script setup>
import { ref, onMounted } from 'vue'

// edit profule, update username and password
let user_credentials = ref({
    password: '',
    // get from Localstorage
    username: localStorage.getItem('name')
})

// update user credentials
const updateProfile = async (flag) => {
    console.log(flag)

    // update username post request to backend /change-username
    if (flag == 'username') {
        // Post Request to backend
        const response = await fetch('http://localhost:3000/change-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                newUsername: user_credentials.value.username
            })
        })

        // set item local storage name
        localStorage.setItem('name', user_credentials.value.username)

        // get response from backend
        const data = await response.json()
        console.log(data)
        
    }else{
        // update password post request to backend /change-password
        // Post Request to backend
        const response = await fetch('http://localhost:3000/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                name: localStorage.getItem('name'),
                newPassword: user_credentials.value.password
            })
        })

        // get response from backend
        const data = await response.json()
        console.log(data)
    }

}



</script>

<style scoped>

.logo {
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.logo img {
  height: 40px;
  width: auto;
}

.logout-button {
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.logout-button:hover {
  color: #41B883;
}


nav {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  align-items: center;
  top: 0;
  height: 50px;
  background-color: #025A6C;
}

</style>