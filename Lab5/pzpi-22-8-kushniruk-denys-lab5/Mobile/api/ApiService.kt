package com.example.slcsystem.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String,
    val profileImage: String? = "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
    val role: String = "user"  // додано роль за замовчуванням
)
data class LoginRequest(val email: String, val password: String)
data class AuthResponse(val token: String, val message: String? = null, val error: String? = null)

data class UpdateRoomStatusRequest(val status: Boolean)
data class UpdateRoomStatusResponse(val message: String, val room: Room)

data class UpdateRoomRequest(
    val user_id: String? = null,
    val name: String? = null,
    val iotDeviceId: String? = null,
    val distance: Float? = null,
    val brightness: Float? = null
)
data class UpdateRoomResponse(val message: String, val room: Room)

interface ApiService {
    @POST("/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @GET("/rooms")
    suspend fun getRooms(): Response<List<Room>>

    @GET("/rooms/info/{roomId}")
    suspend fun getRoomById(@Path("roomId") roomId: String): Response<Room>

    @PATCH("/rooms/updateStatus/{roomId}")
    suspend fun updateRoomStatus(
        @Path("roomId") roomId: String,
        @Body request: UpdateRoomStatusRequest
    ): Response<UpdateRoomStatusResponse>

    @PUT("/rooms/update/{roomId}")
    suspend fun updateRoom(
        @Path("roomId") roomId: String,
        @Body request: UpdateRoomRequest
    ): Response<UpdateRoomResponse>
}
