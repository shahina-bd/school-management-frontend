<script setup>
import { ref } from 'vue'
import BaseTable from '../../components/common/BaseTable.vue'
import BaseButton from '../../components/common/BaseButton.vue'

const payments = ref([
  { id: 1, txn_id: 'TXN-88102', student: 'Alexander Wright', amount: '$450', method: 'Credit Card', date: '2026-10-01' },
  { id: 2, txn_id: 'TXN-88103', student: 'Liam Johnson', amount: '$400', method: 'Bank Transfer', date: '2026-10-02' },
])

const columns = [
  { key: 'txn_id', label: 'Transaction ID' },
  { key: 'student', label: 'Paid By (Student)' },
  { key: 'amount', label: 'Amount Paid' },
  { key: 'method', label: 'Payment Method' },
  { key: 'date', label: 'Transaction Date' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Payment Transactions</h2>
        <p class="text-xs text-slate-500 mt-1">Audit log of all incoming financial payments</p>
      </div>
      <BaseButton variant="primary" size="md">+ Record Manual Payment</BaseButton>
    </div>

    <BaseTable :columns="columns" :items="payments">
      <template #cell-txn_id="{ item }">
        <span class="font-bold text-slate-700 font-mono text-xs">{{ item.txn_id }}</span>
      </template>
    </BaseTable>
  </div>
</template>
