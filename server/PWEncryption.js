const crypto = require("crypto");
require("dotenv").config();

//secret used for encryption
const secret = "pppppppppppppppppppppppppppppppp";

const encrypt = (password) => {
	//create buffer of 16-bytes or 128bits random
	const iv = Buffer.from(crypto.randomBytes(16));
	const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv);

	const encryptedPW = Buffer.concat([cipher.update(password), cipher.final()]);

	return { iv: iv.toString("hex"), password: encryptedPW.toString("hex") };
};

const decrypt = (encryption) => {
	const decipher = crypto.createDecipheriv(
		"aes-256-ctr",
		Buffer.from(secret),
		Buffer.from(encryption.iv, "hex")
	);

	const decryption = Buffer.concat([
		decipher.update(Buffer.from(encryption.password, "hex")),
		decipher.final(),
	]);

	return decryption.toString();
};

module.exports = { encrypt, decrypt };
