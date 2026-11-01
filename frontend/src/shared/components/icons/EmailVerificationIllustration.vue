<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="110" height="95" viewBox="0 0 110 95" fill="none">
    <!-- Envelope body -->
    <rect x="8" y="48" width="94" height="44" rx="4" stroke="#00385A" stroke-width="2" />
    <!-- Envelope bottom fold lines -->
    <line x1="8" y1="92" x2="55" y2="68" stroke="#00385A" stroke-width="1.5" />
    <line x1="102" y1="92" x2="55" y2="68" stroke="#00385A" stroke-width="1.5" />
    <!-- Envelope top flap (open, showing cat) -->
    <path d="M8 48 L55 66 L102 48" stroke="#00385A" stroke-width="1.5" />

    <!-- Cat body (circle) -->
    <circle cx="55" cy="42" r="27" fill="white" stroke="#00385A" stroke-width="2" />

    <!-- Cat left ear -->
    <path
      d="M34 26 L28 10 L44 22"
      stroke="#00385A"
      stroke-width="2"
      stroke-linejoin="round"
      fill="white"
    />
    <!-- Cat right ear -->
    <path
      d="M76 26 L82 10 L66 22"
      stroke="#00385A"
      stroke-width="2"
      stroke-linejoin="round"
      fill="white"
    />

    <!-- Cat eyes -->
    <circle cx="44" cy="40" r="3.5" fill="#00385A" />
    <circle cx="66" cy="40" r="3.5" fill="#00385A" />
    <!-- Eye highlights -->
    <circle cx="45.5" cy="38.5" r="1" fill="white" />
    <circle cx="67.5" cy="38.5" r="1" fill="white" />

    <!-- Cat nose -->
    <path d="M53 47 L55 45 L57 47 L55 49 Z" fill="#00385A" />

    <!-- Cat mouth -->
    <path
      d="M51 51 Q55 55 59 51"
      stroke="#00385A"
      stroke-width="1.5"
      stroke-linecap="round"
    />

    <!-- Left whiskers -->
    <line
      x1="20"
      y1="44"
      x2="40"
      y2="46"
      stroke="#00385A"
      stroke-width="1"
      stroke-linecap="round"
    />
    <line
      x1="20"
      y1="50"
      x2="40"
      y2="50"
      stroke="#00385A"
      stroke-width="1"
      stroke-linecap="round"
    />
    <!-- Right whiskers -->
    <line
      x1="90"
      y1="44"
      x2="70"
      y2="46"
      stroke="#00385A"
      stroke-width="1"
      stroke-linecap="round"
    />
    <line
      x1="90"
      y1="50"
      x2="70"
      y2="50"
      stroke="#00385A"
      stroke-width="1"
      stroke-linecap="round"
    />
  </svg>
</template>
