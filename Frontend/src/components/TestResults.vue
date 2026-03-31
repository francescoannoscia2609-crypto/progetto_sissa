<template>
  <div class="page">
    <div class="container">
      <div class="header">
        <h1>Risultati delle analisi del sangue</h1>
        <div class="user-info" v-if="currentUser">
          <p><strong>Paziente:</strong> {{ currentUser.nome }} {{ currentUser.cognome }}</p>
          <p>
            <strong>Genere:</strong> {{ currentUser.sesso === 'M' ? 'Maschio' : 'Femmina' }} |
            <strong>Età:</strong> {{ calculateAge(currentUser.data_nascita) }} anni
          </p>
        </div>
      </div>

      <div v-if="testResults.length > 0" class="results-section">
        <table class="results-table">
          <thead>
            <tr>
              <th>Esame</th>
              <th>Valore Misurato</th>
              <th>Unità Misura</th>
              <th>Range Normale</th>
              <th>Esito</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="result in testResults"
              :key="result.test_id"
              :class="`status-${result.esito.toLowerCase()}`"
            >
              <td class="exam-name">{{ result.esame }}</td>
              <td class="valore">{{ result.valore_misurato }}</td>
              <td class="unita">{{ result.unita_misura }}</td>
              <td class="range">{{ result.valore_min }} - {{ result.valore_max }}</td>
              <td class="esito">
                <span :class="`badge badge-${result.esito.toLowerCase()}`">
                  {{ result.esito }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="no-results">
        <p>Nessun risultato disponibile. Contatta il tuo medico per effettuare i test.</p>
      </div>

      <div class="legend">
        <h3>Legenda Esiti:</h3>
        <div class="legend-items">
          <div class="legend-item">
            <span class="badge badge-basso"></span> BASSO: Valore inferiore al range normale
          </div>
          <div class="legend-item">
            <span class="badge badge-normale"></span> NORMALE: Valore entro il range normale
          </div>
          <div class="legend-item">
            <span class="badge badge-alto"></span> ALTO: Valore superiore al range normale
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="goToDashboard">Torna al Dashboard</button>
        <button class="btn-secondary" @click="goToHistory">Visualizza Storico</button>
        <button class="btn-secondary" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup name="TestResults">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dati mock dell'utente loggato
const currentUser = ref({
  user_id: 1,
  nome: 'Luca',
  cognome: 'Verdi',
  email: 'bambino@test.com',
  data_nascita: '2016-01-01',
  sesso: 'M',
})

// Mock dei risultati del test (basati sulla query SQL fornita)
const testResults = ref([
  {
    test_id: 1,
    esame: 'Glicemia',
    valore_misurato: 110.0,
    unita_misura: 'mg/dL',
    valore_min: 60.0,
    valore_max: 100.0,
    esito: 'ALTO',
    data_test: '2026-03-16',
  },
  {
    test_id: 2,
    esame: 'Globuli Rossi (RBC)',
    valore_misurato: 4.5,
    unita_misura: '10^6/uL',
    valore_min: 4.0,
    valore_max: 5.2,
    esito: 'NORMALE',
    data_test: '2026-03-16',
  },
  {
    test_id: 3,
    esame: 'Emoglobina (Hb)',
    valore_misurato: 13.5,
    unita_misura: 'g/dL',
    valore_min: 11.5,
    valore_max: 15.5,
    esito: 'NORMALE',
    data_test: '2026-03-16',
  },
  {
    test_id: 4,
    esame: 'Globuli Bianchi (WBC)',
    valore_misurato: 3.5,
    unita_misura: '10^3/uL',
    valore_min: 5.0,
    valore_max: 15.0,
    esito: 'BASSO',
    data_test: '2026-03-16',
  },
  {
    test_id: 5,
    esame: 'Piastrine (PLT)',
    valore_misurato: 250.0,
    unita_misura: '10^3/uL',
    valore_min: 150.0,
    valore_max: 450.0,
    esito: 'NORMALE',
    data_test: '2026-03-16',
  },
  {
    test_id: 6,
    esame: 'Colesterolo Totale',
    valore_misurato: 210.0,
    unita_misura: 'mg/dL',
    valore_min: 120.0,
    valore_max: 170.0,
    esito: 'ALTO',
    data_test: '2026-03-16',
  },
])

// Calcola l'età del paziente
function calculateAge(dataNascita) {
  const oggi = new Date()
  const dataNascitaObj = new Date(dataNascita)
  let age = oggi.getFullYear() - dataNascitaObj.getFullYear()
  const mese = oggi.getMonth() - dataNascitaObj.getMonth()
  if (mese < 0 || (mese === 0 && oggi.getDate() < dataNascitaObj.getDate())) {
    age--
  }
  return age
}

// Naviga al dashboard
function goToDashboard() {
  router.push('/dashboard')
}

// Vai allo storico
function goToHistory() {
  router.push('/history')
}

// Logout
function logout() {
  router.push('/login')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff 0%, #f9f9f9 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 20px;
}

.header h1 {
  margin: 0 0 15px 0;
  color: #1a1a1a;
  font-size: 2rem;
}

.user-info {
  color: #666;
  font-size: 0.95rem;
}

.user-info p {
  margin: 5px 0;
}

.results-section {
  margin: 30px 0;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.results-table thead {
  background: linear-gradient(180deg, #f5f5f5 0%, #efefef 100%);
  border-bottom: 2px solid #d93a4e;
}

.results-table thead th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.results-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;
}

.results-table tbody tr:hover {
  background-color: #f9f9f9;
}

.results-table tbody td {
  padding: 12px;
  font-size: 0.95rem;
  color: #555;
}

.exam-name {
  font-weight: 600;
  color: #1a1a1a;
}

.valore {
  font-weight: 600;
  color: #333;
}

.unita {
  color: #888;
  font-size: 0.85rem;
}

.range {
  color: #888;
  font-size: 0.9rem;
}

.esito {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-basso {
  background-color: #fff3cd;
  color: #ff9800;
}

.badge-normale {
  background-color: #d4edda;
  color: #28a745;
}

.badge-alto {
  background-color: #f8d7da;
  color: #dc3545;
}

/* Evidenziazione righe per esito */
.status-basso {
  background-color: rgba(255, 152, 0, 0.05);
}

.status-normale {
  background-color: rgba(40, 167, 69, 0.05);
}

.status-alto {
  background-color: rgba(220, 53, 69, 0.05);
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 1rem;
}

.legend {
  background: #f9f9f9;
  border-left: 4px solid #d93a4e;
  padding: 20px;
  border-radius: 6px;
  margin: 30px 0;
}

.legend h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1rem;
}

.legend-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-size: 0.9rem;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #b00020;
  color: #fff;
}

.btn-primary:hover {
  background: #850018;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(176, 0, 32, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e0e0e0;
  border-color: #ccc;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .results-table {
    font-size: 0.85rem;
  }

  .results-table thead th,
  .results-table tbody td {
    padding: 8px;
  }

  .actions {
    grid-template-columns: 1fr;
  }

  .legend-items {
    grid-template-columns: 1fr;
  }
}
</style>
