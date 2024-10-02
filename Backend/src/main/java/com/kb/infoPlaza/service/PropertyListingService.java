package com.kb.infoPlaza.service;

import com.kb.infoPlaza.dto.PropertyListingDTO;
import com.kb.infoPlaza.dto.DistrictCodeDTO;
import com.kb.infoPlaza.mapper.PropertyListingMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Log4j
@Service
@RequiredArgsConstructor
public class PropertyListingService {

    private final PropertyListingMapper mapper;

    // 매물 전체 조회
    public List<PropertyListingDTO> selectAllPropertyListings() {
        List<PropertyListingDTO> listings = mapper.selectAllPropertyListings();
        if (listings == null || listings.isEmpty()) {
            listings = new ArrayList<>();
        }
        return listings;
    }

    // 특정 매물 조회
    @Transactional
    public PropertyListingDTO selectPropertyListingById(int plno) {
        log.info("getPropertyListing......" + plno);
        PropertyListingDTO propertyListing = mapper.selectPropertyListingById(plno);
        return Optional.ofNullable(propertyListing)
                .orElseThrow(NoSuchElementException::new);
    }

}
