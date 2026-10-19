// // package com.iem.backend.controller;

// // import com.iem.backend.model.Teacher;
// // import com.iem.backend.service.EmailService;
// // import com.iem.backend.service.SmsService;
// // import com.iem.backend.service.TeacherService;
// // import org.springframework.beans.factory.annotation.Value;
// // import org.springframework.http.HttpStatus;
// // import org.springframework.http.ResponseEntity;
// // import org.springframework.web.bind.annotation.*;

// // import java.util.List;
// // import java.util.Map;

// // @RestController
// // @RequestMapping("/api/teachers")
// // @CrossOrigin(origins = {
// //         "http://localhost:3000",
// //         "http://localhost:5173",
// //         "http://localhost:5174"
// // })
// // public class TeacherController {

// //     private final TeacherService teacherService;
// //     private final EmailService emailService;
// //     private final SmsService smsService;

// //     @Value("${app.default-teacher-password:Temporaire123!}")
// //     private String defaultTeacherPassword;

// //     public TeacherController(TeacherService teacherService,
// //                              EmailService emailService,
// //                              SmsService smsService) {
// //         this.teacherService = teacherService;
// //         this.emailService = emailService;
// //         this.smsService = smsService;
// //     }

// //     @GetMapping
// //     public ResponseEntity<List<Teacher>> getAllTeachers() {
// //         return ResponseEntity.ok(teacherService.findAll());
// //     }

// //     @GetMapping("/{id}")
// //     public ResponseEntity<Teacher> getTeacherById(@PathVariable("id") Long id) {
// //         return teacherService.findById(id)
// //                 .map(ResponseEntity::ok)
// //                 .orElse(ResponseEntity.notFound().build());
// //     }

// //     @GetMapping("/email/{email}")
// //     public ResponseEntity<Teacher> getTeacherByEmail(@PathVariable("email") String email) {
// //         return teacherService.findByEmail(email)
// //                 .map(ResponseEntity::ok)
// //                 .orElse(ResponseEntity.notFound().build());
// //     }

// //     @GetMapping("/search")
// //     public ResponseEntity<List<Teacher>> searchTeachers(@RequestParam(name = "query") String query) {
// //         return ResponseEntity.ok(teacherService.searchTeachers(query));
// //     }

// //     @GetMapping("/type/{type}")
// //     public ResponseEntity<List<Teacher>> getTeachersByType(@PathVariable("type") String type) {
// //         return ResponseEntity.ok(teacherService.findByType(type));
// //     }

// //     @GetMapping("/available")
// //     public ResponseEntity<List<Teacher>> getAvailableTeachers() {
// //         return ResponseEntity.ok(teacherService.findAvailableTeachers());
// //     }

// //     @PostMapping
// //     public ResponseEntity<?> createTeacher(@RequestBody Teacher teacher) {
// //         // ---- validation ----
// //         if (isBlank(teacher.getPrenom()) ||
// //             isBlank(teacher.getNom()) ||
// //             isBlank(teacher.getEmail()) ||
// //             isBlank(teacher.getType())) {
// //             return ResponseEntity.badRequest()
// //                     .body(Map.of("message", "Champs requis manquants (prnom, nom, email, type)."));
// //         }

// //         if (teacherService.findByEmail(teacher.getEmail()).isPresent()) {
// //             return ResponseEntity.status(HttpStatus.CONFLICT)
// //                     .body(Map.of("message", "Un enseignant utilise dj cet email."));
// //         }

// //         try {
// //             Teacher saved = teacherService.save(teacher);

// //             // ---- notifications (email + SMS + WhatsApp) ----
// //             String pwd = defaultTeacherPassword;
// //             String subject = "Bienvenue  IEM Virunga  Vos identifiants";
// //             String body =
// //                     "Bonjour " + saved.getPrenom() + " " + saved.getNom() + ",\n\n" +
// //                     "Votre compte enseignant a t cr.\n" +
// //                     "Email : " + saved.getEmail() + "\n" +
// //                     "Mot de passe temporaire : " + pwd + "\n\n" +
// //                     "Merci de le changer  la premire connexion.\n\n" +
// //                     " IEM Virunga";

// //             safeSendEmail(saved.getEmail(), subject, body);
// //             if (!isBlank(saved.getTelephone())) {
// //                 safeSendSms(saved.getTelephone(), body);
// //                 safeSendWhatsapp(saved.getTelephone(), body);
// //             }

// //             return ResponseEntity.status(HttpStatus.CREATED).body(saved);
// //         } catch (Exception e) {
// //             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// //                     .body(Map.of("message", "Erreur serveur : " + e.getMessage()));
// //         }
// //     }

// //     @PostMapping("/import")
// //     public ResponseEntity<?> importTeachers(@RequestBody List<Teacher> teachers) {
// //         if (teachers == null || teachers.isEmpty()) {
// //             return ResponseEntity.badRequest().body(Map.of("message", "Aucun enseignant  importer."));
// //         }
// //         teacherService.importTeachers(teachers);
// //         return ResponseEntity.ok(Map.of("message", teachers.size() + " enseignants imports."));
// //     }

// //     @PutMapping("/{id}")
// //     public ResponseEntity<?> updateTeacher(@PathVariable("id") Long id, @RequestBody Teacher teacher) {
// //         if (teacherService.findById(id).isEmpty()) {
// //             return ResponseEntity.notFound().build();
// //         }
// //         if (isBlank(teacher.getPrenom()) || isBlank(teacher.getNom()) ||
// //             isBlank(teacher.getEmail()) || isBlank(teacher.getType())) {
// //             return ResponseEntity.badRequest()
// //                     .body(Map.of("message", "Champs requis manquants."));
// //         }
// //         Teacher existing = teacherService.findById(id).get();
// //         if (!existing.getEmail().equals(teacher.getEmail()) &&
// //             teacherService.findByEmail(teacher.getEmail()).isPresent()) {
// //             return ResponseEntity.status(HttpStatus.CONFLICT)
// //                     .body(Map.of("message", "Cet email est dj utilis."));
// //         }
// //         return ResponseEntity.ok(teacherService.update(id, teacher));
// //     }

// //     @PatchMapping("/{id}/toggle-availability")
// //     public ResponseEntity<?> toggleAvailability(@PathVariable("id") Long id) {
// //         try {
// //             return ResponseEntity.ok(teacherService.toggleAvailability(id));
// //         } catch (RuntimeException e) {
// //             return ResponseEntity.notFound().build();
// //         }
// //     }

// //     @DeleteMapping("/{id}")
// //     public ResponseEntity<Void> deleteTeacher(@PathVariable("id") Long id) {
// //         if (teacherService.findById(id).isEmpty()) {
// //             return ResponseEntity.notFound().build();
// //         }
// //         teacherService.deleteById(id);
// //         return ResponseEntity.noContent().build();
// //     }

// //     // ---- helpers ----

// //     private static boolean isBlank(String s) {
// //         return s == null || s.trim().isEmpty();
// //     }

// //     private void safeSendEmail(String to, String subject, String body) {
// //         try { emailService.sendSimpleMessage(to, subject, body); }
// //         catch (Exception e) { System.err.println("Email send failed: " + e.getMessage()); }
// //     }

// //     private void safeSendSms(String to, String body) {
// //         try { smsService.sendSms(to, body); }
// //         catch (Exception e) { System.err.println("SMS send failed: " + e.getMessage()); }
// //     }

// //     private void safeSendWhatsapp(String to, String body) {
// //         try { smsService.sendWhatsapp(to, body); }
// //         catch (Exception e) { System.err.println("WhatsApp send failed: " + e.getMessage()); }
// //     }
// // }

// package com.iem.backend.controller;

// import com.iem.backend.model.Teacher;
// import com.iem.backend.service.EmailService;
// import com.iem.backend.service.SmsService;
// import com.iem.backend.service.TeacherService;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/teachers")
// @CrossOrigin(origins = {
//         "http://localhost:3000",
//         "http://localhost:5173",
//         "http://localhost:5174"
// })
// public class TeacherController {

//     private final TeacherService teacherService;
//     private final EmailService emailService;
//     private final SmsService smsService;

//     public TeacherController(TeacherService teacherService,
//                              EmailService emailService,
//                              SmsService smsService) {
//         this.teacherService = teacherService;
//         this.emailService = emailService;
//         this.smsService = smsService;
//     }

//     //  GET endpoints 

//     @GetMapping
//     public ResponseEntity<List<Teacher>> getAllTeachers() {
//         return ResponseEntity.ok(teacherService.findAll());
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<Teacher> getTeacherById(@PathVariable("id") Long id) {
//         return teacherService.findById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     @GetMapping("/email/{email}")
//     public ResponseEntity<Teacher> getTeacherByEmail(@PathVariable("email") String email) {
//         return teacherService.findByEmail(email)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     @GetMapping("/search")
//     public ResponseEntity<List<Teacher>> searchTeachers(@RequestParam(name = "query") String query) {
//         return ResponseEntity.ok(teacherService.searchTeachers(query));
//     }

//     @GetMapping("/type/{type}")
//     public ResponseEntity<List<Teacher>> getTeachersByType(@PathVariable("type") String type) {
//         return ResponseEntity.ok(teacherService.findByType(type));
//     }

//     @GetMapping("/available")
//     public ResponseEntity<List<Teacher>> getAvailableTeachers() {
//         return ResponseEntity.ok(teacherService.findAvailableTeachers());
//     }

//     //  POST /api/teachers 

//     @PostMapping
//     public ResponseEntity<?> createTeacher(@RequestBody Teacher teacher) {
//         // ---- validation ----
//         if (isBlank(teacher.getPrenom()) ||
//             isBlank(teacher.getNom()) ||
//             isBlank(teacher.getEmail()) ||
//             isBlank(teacher.getType())) {
//             return ResponseEntity.badRequest()
//                     .body(Map.of("message", "Champs requis manquants (prnom, nom, email, type)."));
//         }

//         String normalizedEmail = teacher.getEmail().trim().toLowerCase();
//         teacher.setEmail(normalizedEmail);

//         if (teacherService.findByEmail(normalizedEmail).isPresent()) {
//             return ResponseEntity.status(HttpStatus.CONFLICT)
//                     .body(Map.of("message", "Un enseignant utilise dj cet email."));
//         }

//         try {
//             Teacher saved = teacherService.save(teacher);

//             // ---- notifications (email + SMS + WhatsApp) ----
//             String pwd = TeacherService.DEFAULT_TEMP_PASSWORD;
//             String subject = "Bienvenue  IEM Virunga  Vos identifiants";
//             String body =
//                     "Bonjour " + saved.getPrenom() + " " + saved.getNom() + ",\n\n" +
//                     "Votre compte enseignant a t cr.\n" +
//                     "Email : " + saved.getEmail() + "\n" +
//                     "Mot de passe temporaire : " + pwd + "\n\n" +
//                     "Merci de le changer  la premire connexion.\n\n" +
//                     " IEM Virunga";

//             safeSendEmail(saved.getEmail(), subject, body);
//             if (!isBlank(saved.getTelephone())) {
//                 safeSendSms(saved.getTelephone(), body);
//                 safeSendWhatsapp(saved.getTelephone(), body);
//             }

//             // ---- response includes the temp password so the admin UI can display it ----
//             Map<String, Object> payload = new HashMap<>();
//             payload.put("teacher", saved);
//             payload.put("temporaryPassword", pwd);
//             payload.put("message",
//                     "Compte cr. Un email avec le mot de passe temporaire a t envoy  "
//                             + saved.getEmail() + ".");
//             return ResponseEntity.status(HttpStatus.CREATED).body(payload);

//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Map.of("message", "Erreur serveur : " + e.getMessage()));
//         }
//     }

//     //  POST /api/teachers/import 

//     @PostMapping("/import")
//     public ResponseEntity<?> importTeachers(@RequestBody List<Teacher> teachers) {
//         if (teachers == null || teachers.isEmpty()) {
//             return ResponseEntity.badRequest().body(Map.of("message", "Aucun enseignant  importer."));
//         }
//         teacherService.importTeachers(teachers);
//         return ResponseEntity.ok(Map.of("message", teachers.size() + " enseignants imports."));
//     }

//     //  PUT /api/teachers/{id} 

//     @PutMapping("/{id}")
//     public ResponseEntity<?> updateTeacher(@PathVariable("id") Long id, @RequestBody Teacher teacher) {
//         if (teacherService.findById(id).isEmpty()) {
//             return ResponseEntity.notFound().build();
//         }
//         if (isBlank(teacher.getPrenom()) || isBlank(teacher.getNom()) ||
//             isBlank(teacher.getEmail()) || isBlank(teacher.getType())) {
//             return ResponseEntity.badRequest()
//                     .body(Map.of("message", "Champs requis manquants."));
//         }

//         String newEmail = teacher.getEmail().trim().toLowerCase();
//         Teacher existing = teacherService.findById(id).get();

//         if (!existing.getEmail().equalsIgnoreCase(newEmail) &&
//             teacherService.findByEmail(newEmail).isPresent()) {
//             return ResponseEntity.status(HttpStatus.CONFLICT)
//                     .body(Map.of("message", "Cet email est dj utilis."));
//         }
//         teacher.setEmail(newEmail);
//         return ResponseEntity.ok(teacherService.update(id, teacher));
//     }

//     //  PATCH /api/teachers/{id}/toggle-availability 

//     @PatchMapping("/{id}/toggle-availability")
//     public ResponseEntity<?> toggleAvailability(@PathVariable("id") Long id) {
//         try {
//             return ResponseEntity.ok(teacherService.toggleAvailability(id));
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     //  DELETE /api/teachers/{id} 

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteTeacher(@PathVariable("id") Long id) {
//         if (teacherService.findById(id).isEmpty()) {
//             return ResponseEntity.notFound().build();
//         }
//         teacherService.deleteById(id);
//         return ResponseEntity.noContent().build();
//     }

//     //  helpers 

//     private static boolean isBlank(String s) {
//         return s == null || s.trim().isEmpty();
//     }

//     private void safeSendEmail(String to, String subject, String body) {
//         try { emailService.sendSimpleMessage(to, subject, body); }
//         catch (Exception e) { System.err.println("Email send failed: " + e.getMessage()); }
//     }

//     private void safeSendSms(String to, String body) {
//         try { smsService.sendSms(to, body); }
//         catch (Exception e) { System.err.println("SMS send failed: " + e.getMessage()); }
//     }

//     private void safeSendWhatsapp(String to, String body) {
//         try { smsService.sendWhatsapp(to, body); }
//         catch (Exception e) { System.err.println("WhatsApp send failed: " + e.getMessage()); }
//     }
// }



package com.iem.backend.controller;

import com.iem.backend.model.Teacher;
import com.iem.backend.service.EmailService;
import com.iem.backend.service.SmsService;
import com.iem.backend.service.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174"
})
public class TeacherController {

    private final TeacherService teacherService;
    private final EmailService emailService;
    private final SmsService smsService;

    public TeacherController(TeacherService teacherService,
                             EmailService emailService,
                             SmsService smsService) {
        this.teacherService = teacherService;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    //  GET endpoints 

    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable("id") Long id) {
        return teacherService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Teacher> getTeacherByEmail(@PathVariable("email") String email) {
        return teacherService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Teacher>> searchTeachers(@RequestParam(name = "query") String query) {
        return ResponseEntity.ok(teacherService.searchTeachers(query));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Teacher>> getTeachersByType(@PathVariable("type") String type) {
        return ResponseEntity.ok(teacherService.findByType(type));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Teacher>> getAvailableTeachers() {
        return ResponseEntity.ok(teacherService.findAvailableTeachers());
    }

    //  POST /api/teachers 

    @PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody Teacher teacher) {
        // ---- validation ----
        if (isBlank(teacher.getPrenom()) ||
            isBlank(teacher.getNom()) ||
            isBlank(teacher.getEmail()) ||
            isBlank(teacher.getType())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Champs requis manquants (prnom, nom, email, type)."));
        }

        String normalizedEmail = teacher.getEmail().trim().toLowerCase();
        teacher.setEmail(normalizedEmail);

        if (teacherService.findByEmail(normalizedEmail).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Un enseignant utilise dj cet email."));
        }

        try {
            // teacherService.save() auto-generates the matricule if none was supplied
            Teacher saved = teacherService.save(teacher);

            // ---- notifications (email + SMS + WhatsApp) ----
            String pwd = TeacherService.DEFAULT_TEMP_PASSWORD;
            String subject = "Bienvenue  IEM Virunga  Vos identifiants";
            String body =
                    "Bonjour " + saved.getPrenom() + " " + saved.getNom() + ",\n\n" +
                    "Votre compte enseignant a t cr.\n" +
                    "Matricule : " + saved.getMatricule() + "\n" +
                    "Email : " + saved.getEmail() + "\n" +
                    "Mot de passe temporaire : " + pwd + "\n\n" +
                    "Merci de le changer  la premire connexion.\n\n" +
                    " IEM Virunga";

            safeSendEmail(saved.getEmail(), subject, body);
            if (!isBlank(saved.getTelephone())) {
                safeSendSms(saved.getTelephone(), body);
                safeSendWhatsapp(saved.getTelephone(), body);
            }

            // ---- response includes the temp password so the admin UI can display it ----
            Map<String, Object> payload = new HashMap<>();
            payload.put("teacher", saved);
            payload.put("temporaryPassword", pwd);
            payload.put("message",
                    "Compte cr (matricule " + saved.getMatricule() + "). Un email avec le mot de passe "
                            + "temporaire a t envoy  " + saved.getEmail() + ".");
            return ResponseEntity.status(HttpStatus.CREATED).body(payload);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur serveur : " + e.getMessage()));
        }
    }

    //  POST /api/teachers/import 

    @PostMapping("/import")
    public ResponseEntity<?> importTeachers(@RequestBody List<Teacher> teachers) {
        if (teachers == null || teachers.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Aucun enseignant  importer."));
        }
        teacherService.importTeachers(teachers);
        return ResponseEntity.ok(Map.of("message", teachers.size() + " enseignants imports."));
    }

    //  PUT /api/teachers/{id} 

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable("id") Long id, @RequestBody Teacher teacher) {
        if (teacherService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (isBlank(teacher.getPrenom()) || isBlank(teacher.getNom()) ||
            isBlank(teacher.getEmail()) || isBlank(teacher.getType())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Champs requis manquants."));
        }

        String newEmail = teacher.getEmail().trim().toLowerCase();
        Teacher existing = teacherService.findById(id).get();

        if (!existing.getEmail().equalsIgnoreCase(newEmail) &&
            teacherService.findByEmail(newEmail).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Cet email est dj utilis."));
        }
        teacher.setEmail(newEmail);
        return ResponseEntity.ok(teacherService.update(id, teacher));
    }

    //  PATCH /api/teachers/{id}/toggle-availability 

    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<?> toggleAvailability(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(teacherService.toggleAvailability(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //  DELETE /api/teachers/{id} 

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable("id") Long id) {
        if (teacherService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        teacherService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    //  helpers 

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private void safeSendEmail(String to, String subject, String body) {
        try { emailService.sendSimpleMessage(to, subject, body); }
        catch (Exception e) { System.err.println("Email send failed: " + e.getMessage()); }
    }

    private void safeSendSms(String to, String body) {
        try { smsService.sendSms(to, body); }
        catch (Exception e) { System.err.println("SMS send failed: " + e.getMessage()); }
    }

    private void safeSendWhatsapp(String to, String body) {
        try { smsService.sendWhatsapp(to, body); }
        catch (Exception e) { System.err.println("WhatsApp send failed: " + e.getMessage()); }
    }
}