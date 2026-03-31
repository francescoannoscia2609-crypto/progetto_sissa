<template>
  <div class="page">
    <div class="card">
      <h1>Registrazione</h1>
      <p class="description">Compila i campi per registrare l'utente.</p>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" placeholder="es. mario@esempio.com" />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" placeholder="Password" />
      </div>

      <div class="field grid-2">
        <div>
          <label for="nome">Nome</label>
          <input id="nome" type="text" v-model="nome" placeholder="Nome" />
        </div>
        <div>
          <label for="cognome">Cognome</label>
          <input id="cognome" type="text" v-model="cognome" placeholder="Cognome" />
        </div>
      </div>

      <div class="field">
        <label for="data_nascita">Data di nascita</label>
        <input id="data_nascita" type="date" v-model="data_nascita" />
      </div>

      <div class="field">
        <label for="sesso">Sesso</label>
        <select id="sesso" v-model="sesso">
          <option value="M">M</option>
          <option value="F">F</option>
        </select>
      </div>

      <button class="register-btn" @click="register">Registra</button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup name="UserRegistration">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const email = ref('')
const password = ref('')
const nome = ref('')
const cognome = ref('')
const data_nascita = ref('')
const sesso = ref('M')
const error = ref('')
const success = ref('')

const users = ref([])

function register() {
  error.value = ''
  success.value = ''

  if (
    !email.value ||
    !password.value ||
    !nome.value ||
    !cognome.value ||
    !data_nascita.value ||
    !sesso.value
  ) {
    error.value = 'Compila tutti i campi.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'La password deve avere almeno 6 caratteri.'
    return
  }

  const exists = users.value.some((u) => u.email.toLowerCase() === email.value.toLowerCase())
  if (exists) {
    error.value = 'Questa email è già registrata.'
    return
  }

  users.value.push({
    user_id: users.value.length + 1,
    email: email.value,
    password_hash: password.value,
    nome: nome.value,
    cognome: cognome.value,
    data_nascita: data_nascita.value,
    sesso: sesso.value,
  })

  // Salva gli utenti in localStorage
  localStorage.setItem('users', JSON.stringify(users.value))

  success.value = `Registrazione avvenuta per ${nome.value} ${cognome.value}.`
  email.value = ''
  password.value = ''
  nome.value = ''
  cognome.value = ''
  data_nascita.value = ''
  sesso.value = 'M'

  // Reindirizza a login dopo 1 secondo
  setTimeout(() => router.push('/login'), 1000)
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fff 0%, #fff3f5 60%, #f7d9de 100%);
  padding: 16px;
}
.card {
  width: min(640px, 100%);
  background: #fff;
  border: 2px solid #d93a4e;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
}
.card h1 {
  margin: 0;
  color: #b00020;
  font-size: 1.9rem;
}
.description {
  color: #5b2d36;
  margin-bottom: 10px;
}
.field {
  margin-bottom: 12px;
}
.field label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.field input,
.field select {
  width: 100%;
  height: 36px;
  border: 1px solid #c4c4c4;
  border-radius: 6px;
  padding: 0 8px;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.register-btn {
  width: 100%;
  height: 42px;
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  background: #b00020;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.register-btn:hover {
  background: #8f0017;
}
.error {
  margin-top: 10px;
  color: #b00020;
}
.success {
  margin-top: 10px;
  color: #1d7f00;
}
.hint {
  margin-top: 12px;
  font-size: 0.85rem;
  border: 1px solid #f2c7cb;
  background: #fff5f6;
  border-radius: 6px;
  padding: 8px;
  color: #433537;
}
</style>
