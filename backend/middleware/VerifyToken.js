import auth from "../config/firebase-config.js";

/*const VerifyToken = async (req, res, next) => {
    // Provjera postojanja autorizacionog zaglavlja samo ako je prisutno u zahtevu
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization.split(" ");
      if (authHeader.length === 2 && authHeader[0] === "Bearer ") {
        const token = authHeader[1];
        
        try {
          const decodeValue = await auth.verifyIdToken(token);
          if (decodeValue) {
            req.user = decodeValue;
            return next();
          }
        } catch (e) {
          return res.status(500).json({ message: "Internal Error" });
        }
      } else {
        return res.status(401).json({ message: "Invalid authorization header format" });
      }
    } else {
      // Ako autorizaciono zaglavlje nije prisutno, samo nastavi dalje
      next();
    }
  };*/
const VerifyToken = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
      } catch (error) {
        return res.status(403).json({ message: "Nevalidan ili istekao token." });
      }
    } else {
      return res.status(401).json({ message: "Neautorizovan pristup." });
    }
  };
export default VerifyToken;
