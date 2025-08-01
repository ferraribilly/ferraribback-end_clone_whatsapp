import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: [true, "This email address already exists"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png",
    },
    status: {
      type: String,
      default: "Hey there! I am using whatsapp",
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [
        6,
        "Please make sure your password is at least 6 characters long",
      ],
      maxLength: [
        128,
        "Please make sure your password is less than 128 characters long",
      ],
    },

    sendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    sentOrdersRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    // ✅ CAMPOS OPCIONAIS DE VEÍCULO
    tipoVeiculo: {
      type: String,
      enum: ["carro", "moto", "entregador"],
      required: false,
    },
    marca: {
      type: String,
      default: "",
    },
    cor: {
      type: String,
      default: "",
    },
    placa: {
      type: String,
      default: "",
    },
    precoPorKm: {
      type: Number,
      default: "",
    },
    precoPorMinuto: {
      type: Number,
      default: "",
    },
    taxaFixa: {
      type: Number,
      default: "",
    },
    descontoHorario: {
      type: Number,
      default: "",
    },
    chavePix: {
      type: String,
      default: "",
    },

    // ✅ IMAGENS OPCIONAIS (UPLOAD)
    fotoCNH: {
      type: String,
      default: "",
    },
    fotoDocumentoVeiculo: {
      type: String,
      default: "",
    },
    fotoQrCode: {
      type: String,
      default: "",
    },

    // ✅ LOCALIZAÇÃO GEOSPACIAL
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Índice geoespacial
userSchema.index({ location: "2dsphere" });

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;
