package com.example.slcsystem.api

data class Room(
    val _id: String? = null,
    val user_id: String,
    val name: String,
    val status: Boolean,
    val iotDeviceId: String,
    val distance: Float,
    val brightness: Float
)