<script setup name="UserLogin">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

// Utenti predefiniti
const defaultUsers = [
  {
    user_id: 1,
    email: 'test@example.com',
    password_hash: 'password123',
  },
]

// Combina utenti predefiniti con quelli salvati in localStorage
const users = computed(() => {
  const savedUsers = localStorage.getItem('users')
  const registeredUsers = savedUsers ? JSON.parse(savedUsers) : []
  // Unisce gli utenti predefiniti con quelli registrati, evitando duplicati
  const allUsers = [...defaultUsers]
  registeredUsers.forEach((user) => {
    if (!allUsers.find((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      allUsers.push(user)
    }
  })
  return allUsers
})

function login() {
  error.value = ''
  success.value = ''

  if (!email.value || !password.value) {
    error.value = 'Inserisci email e password.'
    return
  }

  const found = users.value.find((u) => u.email.toLowerCase() === email.value.toLowerCase())
  if (!found) {
    error.value = 'Utente non trovato. Controlla email.'
    return
  }

  if (found.password_hash !== password.value) {
    error.value = 'Password errata.'
    return
  }

  success.value = 'Login effettuato con successo!'

  // Reindirizza a dashboard dopo 1 secondo
  setTimeout(() => router.push('/dashboard'), 1000)
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1>Login</h1>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" placeholder="es. utente@example.com" />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" placeholder="Password" />
      </div>

      <button class="login-btn" @click="login">Accedi</button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <div class="hint">
        <strong>User demo:</strong> email <code>test@example.com</code>, password
        <code>password123</code>.
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fff 0%, #f8f8f8 100%);
  padding: 24px;
}
.card {
  width: min(600px, 100%);
  background: #fff;
  border: 2px solid #d93a4e;
  border-radius: 14px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.08);
  padding: 24px;
  color: #222;
}
.card h1 {
  margin-top: 0;
  color: #b00020;
  font-size: 1.8rem;
}
.card p {
  margin-bottom: 16px;
  color: #333;
}
.field {
  margin-bottom: 12px;
}
.field label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: #444;
}
.field input,
.field select {
  width: 100%;
  border: 1px solid #c0c0c0;
  border-radius: 6px;
  height: 36px;
  padding: 0 10px;
  font-size: 0.95rem;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.login-btn {
  width: 100%;
  margin-top: 10px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #b00020;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.login-btn:hover {
  background: #870018;
}
.error {
  color: #b00020;
  margin: 10px 0 0;
}
.success {
  color: #1d7f00;
  margin: 10px 0 0;
}
.hint {
  margin-top: 12px;
  font-size: 0.9rem;
  background: #fff6f6;
  border: 1px solid #f5c2c7;
  border-radius: 6px;
  padding: 8px;
  color: #444;
}
code {
  background: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
  color: #b00020;
  font-size: 0.9rem;
}
</style>
