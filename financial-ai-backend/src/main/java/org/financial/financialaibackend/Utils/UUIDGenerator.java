package org.financial.financialaibackend.Utils;


import java.util.UUID;

/**
 * The {@code UUIDGenerator} class provides utility methods for generating UUIDs.
 * It generates a unique identifier in a simplified format by removing all hyphens.
 */

public class UUIDGenerator {

    /**
     * Generates a UUID as a unique identifier.
     * <p>
     * The generated UUID is converted to a string and all hyphens ("-")
     * are removed to produce a compact representation.
     * </p>
     *
     * @return A string representation of a UUID without hyphens.
     */
    public static String generateUUID() {
        // Generate a random UUID
        String uuid = UUID.randomUUID().toString();

        // Remove all hyphens from the UUID string and return
        return uuid.replaceAll("-", "");
    }
}
